import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function Settings() {
  const { currentUser, userProfile, userSettings, updateUserName, updateUserEmail, updateUserPassword, enable2FA, disable2FA, setLanguage, deleteAccount } = useAuth();
  const { t, i18n } = useTranslation();
  const [name, setName] = useState(userProfile?.displayName || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [language, setLocalLanguage] = useState(userSettings?.language || "uk");
  const [deletePassword, setDeletePassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
    i18n.changeLanguage(language);
  }, [currentUser, navigate, language, i18n]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (!name.trim()) throw new Error(t("error_name_empty"));
      await updateUserName(name);
      setSuccess(t("success_name_updated"));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) throw new Error(t("error_email_invalid"));
      if (!password) throw new Error(t("error_password_empty"));
      await updateUserEmail(email, password);
      setSuccess(t("success_email_updated"));
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (newPassword.length < 8) throw new Error(t("error_password_short"));
      if (!oldPassword) throw new Error(t("error_password_empty"));
      await updateUserPassword(newPassword, oldPassword);
      setSuccess(t("success_password_updated"));
      setNewPassword("");
      setOldPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEnable2FA = async () => {
    setError("");
    setSuccess("");
    try {
      const { qrCodeUrl } = await enable2FA();
      setQrCodeUrl(qrCodeUrl);
      setShowQRModal(true);
      setSuccess(t("success_tfa_enabled"));
    } catch (err: any) {
      setError(t("error_tfa_failed"));
    }
  };

  const handleDisable2FA = async () => {
    setError("");
    setSuccess("");
    try {
      await disable2FA();
      setQrCodeUrl("");
      setShowQRModal(false);
      setSuccess(t("success_tfa_disabled"));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSetLanguage = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    setError("");
    setSuccess("");
    try {
      await setLanguage(selectedLanguage);
      setLocalLanguage(selectedLanguage);
      i18n.changeLanguage(selectedLanguage);
      setSuccess(t("success_language_updated"));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (!deletePassword) throw new Error(t("error_delete_account_password"));
      await deleteAccount(deletePassword);
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!currentUser || !userProfile) return null;

  const isSteamUser = !!userProfile.steamId;

  return (
    <div className="min-h-screen mt-[160px] bg-black font-mono text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-lime-400 mb-12 text-center uppercase tracking-wider">
          {t("profile_settings")}
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-8 bg-red-500/10 border border-red-500/50 rounded-sm py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-lime-500 text-center mb-8 bg-lime-500/10 border border-lime-500/50 rounded-sm py-2">
            {success}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-neutral-950/90 border border-lime-500/30 rounded-lg p-6 shadow-[0_0_15px_rgba(190,242,100,0.3)]">
            <h3 className="text-2xl font-bold text-lime-400 mb-4 uppercase">{t("profile")}</h3>
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-lime-400 text-sm uppercase mb-2">{t("name")}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 rounded-sm focus:outline-none focus:border-lime-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
              >
                {t("save_name")}
              </button>
            </form>

            {!isSteamUser && (
              <form onSubmit={handleUpdateEmail} className="space-y-4 mt-6">
                <div>
                  <label className="block text-lime-400 text-sm uppercase mb-2">{t("new_email")}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 rounded-sm focus:outline-none focus:border-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-lime-400 text-sm uppercase mb-2">{t("current_password")}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 rounded-sm focus:outline-none focus:border-lime-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
                >
                  {t("save_email")}
                </button>
              </form>
            )}
          </div>

          {!isSteamUser && (
            <div className="bg-neutral-950/90 border border-lime-500/30 rounded-lg p-6 shadow-[0_0_15px_rgba(190,242,100,0.3)]">
              <h3 className="text-2xl font-bold text-lime-400 mb-4 uppercase">{t("security")}</h3>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-lime-400 text-sm uppercase mb-2">{t("new_password")}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 rounded-sm focus:outline-none focus:border-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-lime-400 text-sm uppercase mb-2">{t("current_password")}</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 rounded-sm focus:outline-none focus:border-lime-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
                >
                  {t("save_password")}
                </button>
              </form>

              <div className="mt-6 space-y-4">
                <h4 className="text-lg text-lime-400 uppercase">{t("two_factor_auth")}</h4>
                {userSettings?.twoFactorEnabled ? (
                  <>
                    <p className="text-lime-400">{t("tfa_enabled")}</p>
                    <button
                      onClick={handleDisable2FA}
                      className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
                    >
                      {t("disable_tfa")}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-lime-400">{t("tfa_disabled")}</p>
                    <button
                      onClick={handleEnable2FA}
                      className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
                    >
                      {t("enable_tfa")}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="bg-neutral-950/90 border border-lime-500/30 rounded-lg p-6 shadow-[0_0_15px_rgba(190,242,100,0.3)]">
            <h3 className="text-2xl font-bold text-lime-400 mb-4 uppercase">{t("language")}</h3>
            <select
              value={language}
              onChange={handleSetLanguage}
              className="w-full px-4 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 rounded-sm focus:outline-none focus:border-lime-500"
            >
              <option value="uk">{t("uk")}</option>
              <option value="en">{t("en")}</option>
              <option value="ru">{t("ru")}</option>
            </select>
          </div>

          {!isSteamUser && (
            <div className="bg-neutral-950/90 border border-lime-500/30 rounded-lg p-6 shadow-[0_0_15px_rgba(190,242,100,0.3)]">
              <h3 className="text-2xl font-bold text-lime-400 mb-4 uppercase">{t("delete_account")}</h3>
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div>
                  <label className="block text-lime-400 text-sm uppercase mb-2">{t("current_password")}</label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 rounded-sm focus:outline-none focus:border-lime-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-500/10 border border-red-500 text-red-400 font-semibold py-2 rounded-sm hover:bg-red-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
                >
                  {t("delete_account_button")}
                </button>
              </form>
            </div>
          )}
        </div>

        {showQRModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-neutral-950 p-6 rounded-lg border border-lime-500/30 shadow-[0_0_15px_rgba(190,242,100,0.3)]">
              <h3 className="text-xl text-lime-400 uppercase mb-4">{t("scan_tfa_qr")}</h3>
              <img src={qrCodeUrl} alt="2FA QR Code" className="mx-auto max-w-[200px]" />
              <p className="text-lime-400 text-center mt-4">{t("scan_with_authenticator")}</p>
              <button
                onClick={() => setShowQRModal(false)}
                className="mt-4 w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
              >
                {t("close")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;