const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const cors = require('cors');
const admin = require('firebase-admin');
const QRCode = require('qrcode');
const OTPAuth = require('otpauth');

const app = express();

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

const STEAM_API_KEY = 'F0577A7618F5812DF4FF0E4C0A92C2AE';

passport.use(new SteamStrategy({
  returnURL: 'http://localhost:3000/auth/steam/return',
  realm: 'http://localhost:3000/',
  apiKey: STEAM_API_KEY,
}, async (identifier, profile, done) => {
  try {
    const steamId = profile.id;
    const userDoc = admin.firestore().collection('users').doc(steamId);
    const doc = await userDoc.get();

    if (!doc.exists) {
      await userDoc.set({
        steamId: steamId,
        displayName: profile.displayName,
        avatar: profile.photos[2].value,
        profileUrl: profile._json.profileurl,
      });
      await userDoc.collection('settings').doc('preferences').set({
        language: 'uk',
        twoFactorEnabled: false,
      });
    }

    return done(null, { steamId });
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.steamId);
});

passport.deserializeUser(async (steamId, done) => {
  try {
    const userDoc = admin.firestore().collection('users').doc(steamId);
    const doc = await userDoc.get();
    if (doc.exists) {
      done(null, { steamId });
    } else {
      done(new Error('User not found'), null);
    }
  } catch (err) {
    done(err, null);
  }
});

app.get('/auth/steam', passport.authenticate('steam', { session: true }));

app.get('/auth/steam/return', passport.authenticate('steam', { session: true }), async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('http://localhost:5173/auth/steam/callback?error=steam_auth_failed');
    }

    const steamId = req.user.steamId;
    const customToken = await admin.auth().createCustomToken(steamId);

    req.logout((err) => {
      if (err) {
        res.redirect('http://localhost:5173/auth/steam/callback?error=logout_failed');
        return;
      }
      req.session.destroy((err) => {
        if (err) {
          res.redirect('http://localhost:5173/auth/steam/callback?error=session_destroy_failed');
          return;
        }
        res.redirect(`http://localhost:5173/auth/steam/callback?token=${customToken}`);
      });
    });
  } catch (err) {
    res.redirect('http://localhost:5173/auth/steam/callback?error=token_generation_failed');
  }
});

app.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session destroy failed' });
      }
      res.status(200).json({ message: 'Logged out' });
    });
  });
});

app.post('/generate-2fa', async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: 'No UID provided' });
    }

    const secret = new OTPAuth.Secret();
    const totp = new OTPAuth.TOTP({
      issuer: 'GameStoreApp',
      label: `GameStoreApp:${uid}`,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    });

    const qrCodeUrl = await QRCode.toDataURL(totp.toString());
    res.json({ secret: secret.base32, qrCodeUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate 2FA' });
  }
});

app.post('/verify-2fa', async (req, res) => {
  try {
    const { uid, token } = req.body;
    if (!uid || !token) {
      return res.status(400).json({ error: 'Missing UID or token' });
    }

    const userDoc = admin.firestore().collection('users').doc(uid);
    const settingsDoc = userDoc.collection('settings').doc('preferences');
    const settingsSnap = await settingsDoc.get();

    if (!settingsSnap.exists || !settingsSnap.data().twoFactorSecret) {
      return res.status(400).json({ error: '2FA not enabled' });
    }

    const secret = settingsSnap.data().twoFactorSecret;
    const totp = new OTPAuth.TOTP({
      issuer: 'GameStoreApp',
      label: `GameStoreApp:${uid}`,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });

    const isValid = totp.validate({ token, window: 1 });
    if (isValid === null) {
      return res.status(400).json({ error: 'Invalid 2FA token' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {});