import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function Profile() {
  const { currentUser, userProfile, userSettings, loading, is2FAVerified, verify2FA, set2FAVerified, logout } = useAuth();
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!currentUser || !userProfile)) {
      navigate("/login");
    }
  }, [currentUser, userProfile, loading, navigate]);

const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!/^\d{6}$/.test(code.replace(/\s/g, ''))) {
        throw new Error(t("error_tfa_invalid"));
      }
      await verify2FA(code);
      set2FAVerified(true);
      setError("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t("error_unknown");
      setError(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t("error_unknown");
      setError(t("error_logout") + ": " + errorMessage);
    }
  };

  if (loading || !userSettings) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        {t("loading")}
      </div>
    );
  }

  if (userSettings.twoFactorEnabled && !is2FAVerified) {
    return (
      <div className="min-h-screen mt-[30px] bg-black font-mono text-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-neutral-950/90 border border-lime-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(190,242,100,0.3)]">
          <h2 className="text-3xl font-bold text-lime-400 mb-6 text-center uppercase tracking-wider">
            {t("enter_tfa_code")}
          </h2>
          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}
          <form onSubmit={handle2FASubmit} className="space-y-4">
            <div>
              <label className="block text-lime-400 font-semibold mb-2">
                {t("tfa_code")}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("enter_tfa_code")}
                className="w-full bg-neutral-900 border border-lime-500/50 text-white rounded-sm py-2 px-3 focus:outline-none focus:border-lime-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
            >
              {t("verify_tfa")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">
        {t("error_no_user")}
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[30px] bg-black font-mono text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-neutral-950/90 border border-lime-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(190,242,100,0.3)]">
        <h2 className="text-3xl font-bold text-lime-400 mb-6 text-center uppercase tracking-wider">
          {t("profile")}
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={userProfile.avatar || "../src/assets/avatar.png"}
              alt="Avatar"
              className="size-32 rounded-full border-2 border-lime-500/50"
            />
          </div>
          <p className="text-lime-400 text-center">
            <span className="font-semibold">{t("name")}:</span> {userProfile.displayName}
          </p>
          {userProfile.email && (
            <p className="text-lime-400 text-center">
              <span className="font-semibold">{t("email")}:</span> {userProfile.email}
            </p>
          )}
          {userProfile.steamId && (
            <p className="text-lime-400 text-center">
              <span className="font-semibold">SteamID:</span> {userProfile.steamId}
            </p>
          )}
          {userProfile.profileUrl && (
            <p className="text-lime-400 text-center">
              <span className="font-semibold">{t("profile")} Steam:</span>{" "}
              <a
                href={userProfile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime-500 hover:text-lime-400"
              >
                {t("view")}
              </a>
            </p>
          )}
          {userProfile.countryCode && (
            <p className="text-lime-400 text-center">
              <span className="font-semibold">{t("country")}:</span> {userProfile.countryCode}
            </p>
          )}
          <div className="border-t border-lime-500/20 pt-4">
            <p className="text-lime-400 text-center">
              <span className="font-semibold">{t("auth_status")}:</span>{" "}
              <span className="text-lime-400">
                {t("verified_via")}{" "}
                {userProfile.steamId
                  ? "Steam"
                  : currentUser.providerData[0]?.providerId.includes("google")
                  ? "Google"
                  : currentUser.providerData[0]?.providerId.includes("facebook")
                  ? "Facebook"
                  : "Email"}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );
}

export default Profile;