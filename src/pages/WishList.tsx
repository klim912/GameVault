import { useEffect } from "react";
import { useWishlist } from "../components/WishlistContext";
import { useCart } from "../components/CartContext";
import { Trash2 } from "react-feather";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

function Wishlist() {
  const wishlistContext = useWishlist();
  const cartContext = useCart();
  const { t, i18n } = useTranslation();
  const { userSettings } = useAuth();

  useEffect(() => {
    if (userSettings?.language) {
      i18n.changeLanguage(userSettings.language);
    }
  }, [userSettings, i18n]);

  if (!wishlistContext || !cartContext) {
    return (
      <div className="flex justify-center items-center h-screen bg-black font-mono text-red-500 text-lg">
        {t("context_error")}
      </div>
    );
  }

  const { wishlist, removeFromWishlist } = wishlistContext;
  const { addToCart } = cartContext;

  interface BuyGame {
    title: string;
    thumb: string;
    salePrice: string;
    gameID: string;
  }

  const handleBuy = (game: BuyGame) => {
    addToCart({
      title: game.title,
      thumb: game.thumb,
      salePrice: game.salePrice,
      gameID: game.gameID,
    });
    removeFromWishlist(game.title);
  };

  return (
    <div className="min-h-screen bg-black font-mono text-white py-12 px-4 mt-10">
      <div className="max-w-6xl mx-auto mt-16">
        <h2
          className="text-3xl md:text-4xl font-bold text-lime-400 mb-10 text-center tracking-wider relative
            before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-lime-500/50
            before:transform before:transition-transform before:duration-300 hover:before:scale-x-110"
        >
          {t("wishlist_title")}
        </h2>

        {wishlist.length === 0 ? (
          <p className="text-center text-lg text-neutral-500 tracking-wide">
            {t("wishlist_empty")}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((game) => (
              <div
                key={game.title}
                className="relative bg-neutral-950/90 border border-lime-500/30 rounded-md overflow-hidden transition-all duration-500 hover:border-lime-500/50 hover:scale-105 group"
              >
                <div className="absolute inset-0 -z-10 bg-lime-500/10 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>

                <Link
                  to={`/game/${game.gameID}`}
                  className="text-base md:text-lg font-semibold text-lime-400 text-center p-4 tracking-wide line-clamp-2 h-16 mb-4 block"
                >
                  {game.title || t("unknown_game")}
                </Link>

                <div className="relative w-full h-48 bg-black flex justify-center items-center">
                  <img
                    src={game.thumb}
                    alt={t("game_image")}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 border border-lime-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="flex justify-between items-center p-4 bg-neutral-950/50 border-t border-lime-500/20">
                  <span className="text-lg text-green-400 font-bold">
                    {game.salePrice} $
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBuy(game)}
                      className="bg-lime-500/10 border border-lime-500 text-lime-400 text-sm px-4 py-2 rounded-sm
                        hover:bg-lime-500 hover:text-black transition-all duration-300 transform hover:scale-110"
                    >
                      {t("buy_now")}
                    </button>
                    <button
                      onClick={() => removeFromWishlist(game.title)}
                      className="bg-neutral-900/50 border border-lime-500/50 text-lime-400 p-2 rounded-sm
                        hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 transform hover:scale-110"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;