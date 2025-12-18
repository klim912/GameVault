import { useEffect, useState } from "react";
import GameCard from "./GameCard";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

type GameListProps = {
  searchParams: URLSearchParams;
};

function GameList({ searchParams }: GameListProps) {
  const [games, setGames] = useState<any[]>([]);
  const [visible, setVisible] = useState(8);

  const { t, i18n } = useTranslation();
  const { userSettings } = useAuth();

  useEffect(() => {
    if (userSettings?.language) {
      i18n.changeLanguage(userSettings.language);
    }
  }, [userSettings, i18n]);

  useEffect(() => {
    const search = searchParams.get("search")?.toLowerCase() || "";
    const genre = searchParams.get("genre")?.toLowerCase() || "";
    const sort = searchParams.get("sort") || "price-asc";

    const query = search || genre;

    const url = `https://www.cheapshark.com/api/1.0/deals?storeID=3&upperPrice=100&title=${query}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => {
          switch (sort) {
            case "price-asc":
              return parseFloat(a.salePrice) - parseFloat(b.salePrice);
            case "price-desc":
              return parseFloat(b.salePrice) - parseFloat(a.salePrice);
            case "rating-asc":
              return (
                parseFloat(a.dealRating ?? 0) - parseFloat(b.dealRating ?? 0)
              );
            case "rating-desc":
              return (
                parseFloat(b.dealRating ?? 0) - parseFloat(a.dealRating ?? 0)
              );
            default:
              return 0;
          }
        });

        setGames(sorted);
      })
      .catch((err) => console.error(`${t("error_fetch")}:`, err));
  }, [searchParams, t]);

  return (
    <div>
      <p className="text-gray-600 mb-4">{t("games_found", { count: games.length })}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.slice(0, visible).map((game) => (
          <GameCard key={game.gameID} game={game} />
        ))}
      </div>

      {visible < games.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisible((v) => v + 8)}
            className="px-6 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 text-sm rounded-sm uppercase tracking-wide font-mono
              hover:bg-lime-500 hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            {t("load_more")}
          </button>
        </div>
      )}

      {games.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          {t("no_results")}
        </div>
      )}
    </div>
  );
}

export default GameList;