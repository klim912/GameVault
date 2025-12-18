import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation();
  const { userSettings } = useAuth();

  useEffect(() => {
    if (userSettings?.language) {
      i18n.changeLanguage(userSettings.language);
    }
  }, [userSettings, i18n]);

  return (
    <div className="bg-black mt-[190px] border-b-4 border-white min-h-screen px-6 py-10 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto border-l-4 border-lime-500 pl-6"
      >
        <h1
          className="text-3xl md:text-4xl font-bold text-lime-400 mb-6 tracking-wider uppercase font-mono
            relative before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-lime-500/50
            before:transform before:transition-transform before:duration-300 hover:before:scale-x-110"
        >
          {t("privacy_policy")}
        </h1>

        <section className="mb-8">
          <p className="mb-4 text-neutral-400 text-sm leading-relaxed uppercase tracking-wide font-mono">
            {t("privacy_intro")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl text-lime-400 uppercase tracking-wide mb-2 font-mono">
            {t("privacy_data_collection")}
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed font-mono">
            {t("privacy_data_collection_desc")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl text-lime-400 uppercase tracking-wide mb-2 font-mono">
            {t("privacy_data_usage")}
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed font-mono">
            {t("privacy_data_usage_desc")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl text-lime-400 uppercase tracking-wide mb-2 font-mono">
            {t("privacy_data_protection")}
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed font-mono">
            {t("privacy_data_protection_desc")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl text-lime-400 uppercase tracking-wide mb-2 font-mono">
            {t("privacy_user_rights")}
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed font-mono">
            {t("privacy_user_rights_desc")}
          </p>
        </section>

        <p className="mt-10 text-xs text-lime-400 italic uppercase tracking-wide font-mono">
          {t("last_updated")}
        </p>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;