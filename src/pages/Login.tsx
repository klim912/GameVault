import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { auth } from "../init/firebase";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, signInWithFacebook, signInWithEmail, userSettings } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [error, setError] = useState(location.state?.error || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn && userSettings) {
      if (userSettings.twoFactorEnabled) {
        setShow2FA(true);
      } else {
        navigate("/profile");
      }
    }
  }, [isLoggedIn, userSettings, navigate]);

  const handleSteamLogin = () => {
    window.location.href = "http://localhost:3000/auth/steam";
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/profile");
    } catch (err: any) {
      setError(t("error_google_login") + err.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithFacebook();
      navigate("/profile");
    } catch (err: any) {
      setError(t("error_facebook_login") + err.message);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      setIsLoggedIn(true);
    } catch (err: any) {
      setError(t("error_email_login") + err.message);
    }
  };

  const handle2FAVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!auth.currentUser) {
        throw new Error(t("error_no_user"));
      }
      const response = await fetch("http://localhost:3000/verify-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify({ uid: auth.currentUser.uid, token: twoFactorCode }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(t("error_tfa_invalid"));
      }
      navigate("/profile");
    } catch (err: any) {
      setError(t("error_tfa_verification") + err.message);
    }
  };

  return (
    <div className="min-h-screen mt-15 bg-black font-mono text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-neutral-950/90 border border-lime-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(190,242,100,0.3)]">
        <h2 className="text-3xl font-bold text-lime-400 mb-6 text-center uppercase tracking-wider">
          {t("login")}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {!show2FA ? (
          <>
            <button
              onClick={handleSteamLogin}
              className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide mb-4"
            >
              {t("login_steam")}
            </button>
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide mb-4"
            >
              {t("login_google")}
            </button>
            <button
              onClick={handleFacebookLogin}
              className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide mb-4"
            >
              {t("login_facebook")}
            </button>
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-lime-400 font-semibold mb-1">{t("email")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-lime-500/30 text-white py-2 px-3 rounded-sm focus:outline-none focus:border-lime-500"
                  required
                />
              </div>
              <div>
                <label className="block text-lime-400 font-semibold mb-1">{t("password")}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-lime-500/30 text-white py-2 px-3 rounded-sm focus:outline-none focus:border-lime-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
              >
                {t("login_email")}
              </button>
            </form>
            <p className="text-neutral-300 text-center mt-4">
              {t("forgot_password")}{" "}
              <Link to="/reset-password" className="text-lime-400 hover:text-lime-500">
                {t("reset")}
              </Link>
            </p>
            <p className="text-neutral-300 text-center mt-2">
              {t("no_account")}{" "}
              <Link to="/register" className="text-lime-400 hover:text-lime-500">
                {t("register")}
              </Link>
            </p>
          </>
        ) : (
          <form onSubmit={handle2FAVerification} className="space-y-4">
            <div>
              <label className="block text-lime-400 font-semibold mb-1">{t("tfa_code")}</label>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-full bg-neutral-900 border border-lime-500/30 text-white py-2 px-3 rounded-sm focus:outline-none focus:border-lime-500"
                placeholder={t("enter_tfa_code")}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
            >
              {t("verify_tfa")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;