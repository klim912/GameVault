import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { getAuth, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';

const SteamCallback = () => {
  const { t } = useTranslation();
  const { currentUser, userSettings, is2FAVerified, verify2FA, set2FAVerified } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const errorParam = query.get('error');

    if (errorParam) {
      setError(t(`error_${errorParam}`) || t('error_steam_login'));
      navigate('/login');
      return;
    }

    if (token && !currentUser && !authLoading) {
      setAuthLoading(true);
      const auth = getAuth();
      signInWithCustomToken(auth, token)
        .then(() => {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              setAuthLoading(false);
              unsubscribe();
            }
          });
          setTimeout(() => {
            if (authLoading) {
              setError(t('error_steam_login'));
              setAuthLoading(false);
              navigate('/login');
            }
          }, 5000);
        })
        .catch((err) => {
          setError(t('error_steam_login') + ': ' + err.message);
          setAuthLoading(false);
          navigate('/login');
        });
    }
  }, [location, currentUser, authLoading, navigate, t]);

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!/^\d{6}$/.test(code.replace(/\s/g, ''))) {
        throw new Error(t('error_tfa_invalid'));
      }
      await verify2FA(code);
      set2FAVerified(true);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (authLoading || !userSettings || !currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        {t('loading')}
      </div>
    );
  }

  if (userSettings.twoFactorEnabled && !is2FAVerified) {
    return (
      <div className="min-h-screen mt-[30px] bg-black font-mono text-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-neutral-950/90 border border-lime-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(190,242,100,0.3)]">
          <h2 className="text-3xl font-bold text-lime-400 mb-6 text-center uppercase tracking-wider">
            {t('enter_tfa_code')}
          </h2>
          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}
          <form onSubmit={handle2FASubmit} className="space-y-4">
            <div>
              <label className="block text-lime-400 font-semibold mb-2">
                {t('tfa_code')}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t('enter_tfa_code')}
                className="w-full bg-neutral-900 border border-lime-500/50 text-white rounded-sm py-2 px-3 focus:outline-none focus:border-lime-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
            >
              {t('verify_tfa')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  navigate('/profile');
  return null;
};

export default SteamCallback;