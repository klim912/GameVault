import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

interface UserProfile {
  displayName: string;
  avatar: string;
  email?: string;
  steamId?: string;
  profileUrl?: string;
  countryCode?: string;
  stateCode?: string;
  cityId?: number | null;
}

interface UserSettings {
  language: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
}

interface AuthContextType {
  currentUser: any;
  userProfile: UserProfile | null;
  userSettings: UserSettings | null;
  loading: boolean;
  is2FAVerified: boolean;
  set2FAVerified: (verified: boolean) => void;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithSteam: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  updateUserEmail: (email: string, password: string) => Promise<void>;
  updateUserPassword: (newPassword: string, oldPassword: string) => Promise<void>;
  enable2FA: () => Promise<{ secret: string; qrCodeUrl: string }>;
  verify2FA: (code: string) => Promise<void>;
  disable2FA: () => Promise<void>;
  setLanguage: (language: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  userSettings: null,
  loading: true,
  is2FAVerified: false,
  set2FAVerified: () => {},
  logout: async () => {},
  signInWithGoogle: async () => {},
  signInWithFacebook: async () => {},
  signInWithSteam: async () => {},
  signInWithEmail: async () => {},
  register: async () => {},
  resetPassword: async () => {},
  updateUserName: async () => {},
  updateUserEmail: async () => {},
  updateUserPassword: async () => {},
  enable2FA: async () => ({ secret: "", qrCodeUrl: "" }),
  verify2FA: async () => {},
  disable2FA: async () => {},
  setLanguage: async () => {},
  deleteAccount: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = getAuth();
  const db = getFirestore();
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [is2FAVerified, set2FAVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDoc = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              displayName: user.displayName || user.email || "Користувач",
              avatar: user.photoURL || "../src/assets/avatar.png",
              email: user.email || undefined,
            };
            await setDoc(userDoc, newProfile);
            setUserProfile(newProfile);
          }

          const settingsDoc = doc(db, "users", user.uid, "settings", "preferences");
          const settingsSnap = await getDoc(settingsDoc);
          if (settingsSnap.exists()) {
            setUserSettings(settingsSnap.data() as UserSettings);
          } else {
            const defaultSettings: UserSettings = {
              language: "uk",
              twoFactorEnabled: false,
            };
            await setDoc(settingsDoc, defaultSettings);
            setUserSettings(defaultSettings);
          }
        } catch (err: any) {
          setUserProfile({
            displayName: user.displayName || user.email || "Користувач",
            avatar: user.photoURL || "../src/assets/avatar.png",
            email: user.email || undefined,
          });
          setUserSettings({ language: "uk", twoFactorEnabled: false });
        }
      } else {
        setUserProfile(null);
        setUserSettings(null);
        set2FAVerified(false);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [auth, db, is2FAVerified]);

  const logout = async () => {
    try {
      await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include',
      });
      await signOut(auth);
      setUserProfile(null);
      setUserSettings(null);
      set2FAVerified(false);
    } catch (err: any) {
      throw new Error(t("error_logout"));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      throw new Error(t("error_google_login"));
    }
  };

  const signInWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      throw new Error(t("error_facebook_login"));
    }
  };

  const signInWithSteam = async () => {
    try {
      window.location.href = 'http://localhost:3000/auth/steam';
    } catch (err: any) {
      throw new Error(t("error_steam_login"));
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (!user.emailVerified) {
        throw new Error(t("error_email_not_verified"));
      }
    } catch (err: any) {
      throw new Error(t("error_email_login") + ": " + err.message);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });
      await sendEmailVerification(user);

      const userDoc = doc(db, "users", user.uid);
      const newProfile: UserProfile = {
        displayName: name,
        avatar: "../src/assets/avatar.png",
        email,
      };
      await setDoc(userDoc, newProfile);

      const settingsDoc = doc(db, "users", user.uid, "settings", "preferences");
      const defaultSettings: UserSettings = {
        language: "uk",
        twoFactorEnabled: false,
      };
      await setDoc(settingsDoc, defaultSettings);
    } catch (err: any) {
      throw new Error(t("error_registration") + ": " + err.message);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      throw new Error(t("error_password_reset") + ": " + err.message);
    }
  };

  const updateUserName = async (name: string) => {
    if (!currentUser) throw new Error(t("error_no_user"));
    try {
      await updateProfile(currentUser, { displayName: name });

      const userDoc = doc(db, "users", currentUser.uid);
      await setDoc(userDoc, { displayName: name }, { merge: true });

      setUserProfile((prev) => (prev ? { ...prev, displayName: name } : null));
    } catch (err: any) {
      throw new Error(t("error_name_update") + ": " + err.message);
    }
  };

  const updateUserEmail = async (email: string, password: string) => {
    if (!currentUser) throw new Error(t("error_no_user"));
    try {
      const credential = EmailAuthProvider.credential(currentUser.email!, password);
      await reauthenticateWithCredential(currentUser, credential);

      await updateEmail(currentUser, email);
      await sendEmailVerification(currentUser);

      const userDoc = doc(db, "users", currentUser.uid);
      await setDoc(userDoc, { email }, { merge: true });

      setUserProfile((prev) => (prev ? { ...prev, email } : null));
    } catch (err: any) {
      throw new Error(t("error_email_update") + ": " + err.message);
    }
  };

  const updateUserPassword = async (newPassword: string, oldPassword: string) => {
    if (!currentUser) throw new Error(t("error_no_user"));
    try {
      const credential = EmailAuthProvider.credential(currentUser.email!, oldPassword);
      await reauthenticateWithCredential(currentUser, credential);

      await updatePassword(currentUser, newPassword);
    } catch (err: any) {
      throw new Error(t("error_password_update") + ": " + err.message);
    }
  };

  const enable2FA = async () => {
    if (!currentUser) throw new Error(t("error_no_user"));
    try {
      const response = await fetch("http://localhost:3000/generate-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await currentUser.getIdToken()}`,
        },
        body: JSON.stringify({ uid: currentUser.uid }),
      });
      if (!response.ok) {
        throw new Error(t("error_tfa_failed"));
      }
      const { secret, qrCodeUrl } = await response.json();

      const settingsDoc = doc(db, "users", currentUser.uid, "settings", "preferences");
      await setDoc(settingsDoc, { twoFactorEnabled: true, twoFactorSecret: secret }, { merge: true });

      setUserSettings((prev) => (prev ? { ...prev, twoFactorEnabled: true, twoFactorSecret: secret } : null));
      return { secret, qrCodeUrl };
    } catch (err: any) {
      throw new Error(t("error_tfa_failed") + ": " + err.message);
    }
  };

  const verify2FA = async (code: string) => {
    if (!currentUser) throw new Error(t("error_no_user"));
    try {
      const normalizedCode = code.replace(/\s/g, '');

      const response = await fetch("http://localhost:3000/verify-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await currentUser.getIdToken()}`,
        },
        body: JSON.stringify({ uid: currentUser.uid, token: normalizedCode }),
      });

      if (!response.ok) {
        throw new Error(t("error_tfa_verification"));
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(t("error_tfa_invalid"));
      }

      set2FAVerified(true);
    } catch (err: any) {
      throw new Error(t("error_tfa_verification") + ": " + err.message);
    }
  };

  const disable2FA = async () => {
    if (!currentUser) throw new Error(t("error_no_user"));
    try {
      const settingsDoc = doc(db, "users", currentUser.uid, "settings", "preferences");
      await setDoc(settingsDoc, { twoFactorEnabled: false, twoFactorSecret: null }, { merge: true });

      setUserSettings((prev) => (prev ? { ...prev, twoFactorEnabled: false, twoFactorSecret: undefined } : null));
      set2FAVerified(false);
    } catch (err: any) {
      throw new Error(t("error_tfa_disable") + ": " + err.message);
    }
  };

  const setLanguage = async (language: string) => {
    if (!currentUser) throw new Error(t("error_no_user"));
    try {
      const settingsDoc = doc(db, "users", currentUser.uid, "settings", "preferences");
      await setDoc(settingsDoc, { language }, { merge: true });

      setUserSettings((prev) => (prev ? { ...prev, language } : null));
    } catch (err: any) {
      throw new Error(t("error_language_update") + ": " + err.message);
    }
  };

  const deleteAccount = async (password: string) => {
    if (!currentUser) throw new Error(t("error_no_user"));
    try {
      const credential = EmailAuthProvider.credential(currentUser.email!, password);
      await reauthenticateWithCredential(currentUser, credential);

      const userDoc = doc(db, "users", currentUser.uid);
      await deleteDoc(userDoc);

      const settingsDoc = doc(db, "users", currentUser.uid, "settings", "preferences");
      await deleteDoc(settingsDoc);

      await deleteUser(currentUser);

      setUserProfile(null);
      setUserSettings(null);
      set2FAVerified(false);
    } catch (err: any) {
      throw new Error(t("error_delete_account") + ": " + err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        userSettings,
        loading,
        is2FAVerified,
        set2FAVerified,
        logout,
        signInWithGoogle,
        signInWithFacebook,
        signInWithSteam,
        signInWithEmail,
        register,
        resetPassword,
        updateUserName,
        updateUserEmail,
        updateUserPassword,
        enable2FA,
        verify2FA,
        disable2FA,
        setLanguage,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}