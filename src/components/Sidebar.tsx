import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

function Sidebar({ setSearchParams }: { setSearchParams: any }) {
  const [sortOption, setSortOption] = useState(() => {
    return localStorage.getItem("sortOption") || "price-asc";
  });

  const { t, i18n } = useTranslation();
  const { userSettings } = useAuth();

  useEffect(() => {
    if (userSettings?.language) {
      i18n.changeLanguage(userSettings.language);
    }
  }, [userSettings, i18n]);

  useEffect(() => {
    localStorage.setItem("sortOption", sortOption);
    setSearchParams((prev: URLSearchParams) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sort", sortOption);
      return newParams;
    });
  }, [sortOption, setSearchParams]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev: URLSearchParams) => {
      const newParams = new URLSearchParams(prev);
      newParams.set(name, value);
      return newParams;
    });
  };

  return (
    <aside
      className="w-64 bg-neutral-950 border-r mt-[30px] border-lime-500/30 p-6 text-white font-mono sticky top-0 self-start min-h-screen"
      style={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <h2
        className="text-xl md:text-2xl font-bold text-lime-400 mb-8 tracking-wider uppercase relative
          before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-lime-500/50
          before:transform before:transition-transform before:duration-300 hover:before:scale-x-110"
      >
        {t("filters")}
      </h2>

      <div className="space-y-6">
        <div>
          <label className="text-lime-400 text-sm tracking-wide uppercase">
            {t("genre")}
          </label>
          <select
            name="genre"
            onChange={handleFilterChange}
            className="w-full bg-neutral-900/50 border border-lime-500/50 text-lime-400 text-sm p-3 mt-2 rounded-sm
              focus:outline-none focus:border-lime-500 hover:bg-neutral-900/70 transition-all duration-300"
          >
            <option value="">{t("all")}</option>
            <option value="Action">{t("genre_action")}</option>
            <option value="RPG">{t("genre_rpg")}</option>
            <option value="Shooter">{t("genre_shooter")}</option>
            <option value="Strategy">{t("genre_strategy")}</option>
          </select>
        </div>

        <div>
          <label className="text-lime-400 text-sm tracking-wide uppercase">
            {t("sort_by")}
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full bg-neutral-900/50 border border-lime-500/50 text-lime-400 text-sm p-3 mt-2 rounded-sm
              focus:outline-none focus:border-lime-500 hover:bg-neutral-900/70 transition-all duration-300"
          >
            <option value="price-asc">{t("price_asc")}</option>
            <option value="price-desc">{t("price_desc")}</option>
            <option value="rating-asc">{t("rating_asc")}</option>
            <option value="rating-desc">{t("rating_desc")}</option>
          </select>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;