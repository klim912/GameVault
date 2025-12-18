import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { Heart } from "react-feather";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function GameCard({ game }: { game: any }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { t, i18n } = useTranslation();
  const { userSettings } = useAuth();

  useEffect(() => {
    if (userSettings?.language) {
      i18n.changeLanguage(userSettings.language);
    }
  }, [userSettings, i18n]);

  return (
    <Link
      to={`/game/${game.dealID}`}
      className="relative bg-neutral-950/90 border border-lime-500/30 rounded-md overflow-hidden transition-all duration-500 hover:border-lime-500/50 hover:scale-105 group"
    >
      <div className="absolute inset-0 -z-10 bg-lime-500/10 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>

      <h2 className="text-base md:text-lg font-mono font-semibold text-lime-400 text-center p-4 tracking-wide line-clamp-2 h-16">
        {game.title}
      </h2>

      <div className="relative w-full h-40 bg-black flex justify-center items-center">
        <img
          src={game.thumb}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-500 group-hover:brightness-110"
        />
        <div className="absolute inset-0 border border-lime-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="flex justify-between items-center p-4 bg-neutral-950/50 border-t border-lime-500/20">
        <span className="text-lg font-mono text-green-400 font-bold">
          {game.salePrice} $
        </span>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(game);
            }}
            className="bg-lime-500/10 border border-lime-500 text-lime-400 font-mono text-sm px-4 py-2 rounded-sm
              hover:bg-lime-500 hover:text-black transition-all duration-300 transform hover:scale-110"
          >
            {t("buy")}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToWishlist(game);
            }}
            className="bg-neutral-900/50 border border-lime-500/50 text-lime-400 p-2 rounded-sm
              hover:bg-lime-500/20 transition-all duration-300 transform hover:scale-110"
          >
            <Heart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default GameCard;