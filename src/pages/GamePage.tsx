import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWishlist } from "../components/WishlistContext";
import { useCart } from "../components/CartContext";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

interface Review {
  gameTitle: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: string;
}

function GamePage() {
  const { id } = useParams();
  const [game, setGame] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToWishlist, removeFromWishlist, isGameWishlisted } = useWishlist();
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    userName: "",
    rating: 0,
    comment: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const { t, i18n } = useTranslation();
  const { userSettings } = useAuth();

  useEffect(() => {
    if (userSettings?.language) {
      i18n.changeLanguage(userSettings.language);
    }
  }, [userSettings, i18n]);

  useEffect(() => {
    if (!id) {
      setError(t("invalid_game_id"));
      return;
    }

    fetch(`https://www.cheapshark.com/api/1.0/deals?id=${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(t("error_loading_game"));
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        console.log("gameInfo:", data.gameInfo);
        setGame(data);
        setError(null);
      })
      .catch((err) => {
        console.error(`${t("error_fetch")}:`, err);
        setError(err.message);
      });
  }, [id, t]);

  useEffect(() => {
    if (game && game.gameInfo && game.gameInfo.name) {
      setIsWishlisted(isGameWishlisted(game.gameInfo.name));
      setIsInCart(cartItems.some((item) => item.title === game.gameInfo.name));

      const storedReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
      const gameReviews = storedReviews.filter(
        (review: Review) => review.gameTitle === game.gameInfo.name
      );
      setReviews(gameReviews);
    }
  }, [game, isGameWishlisted, cartItems]);

  const handleAddToWishlist = () => {
    if (!game || !id || !game.gameInfo.name) return;

    const gameData = {
      title: game.gameInfo.name,
      thumb: game.gameInfo.thumb || "",
      salePrice: game.gameInfo.salePrice || "0",
      gameID: id,
    };

    if (isWishlisted) {
      removeFromWishlist(game.gameInfo.name);
      setIsWishlisted(false);
      console.log("Removed from Wishlist", game.gameInfo.name);
    } else {
      addToWishlist(gameData);
      setIsWishlisted(true);
      console.log("Added to Wishlist", game.gameInfo.name);
    }
  };

  const handleAddToCart = () => {
    if (!game || !id || !game.gameInfo.name) return;

    const gameData = {
      title: game.gameInfo.name,
      thumb: game.gameInfo.thumb || "",
      salePrice: game.gameInfo.salePrice || "0",
      gameID: id,
    };

    if (isInCart) {
      removeFromCart(game.gameInfo.name);
      setIsInCart(false);
      console.log("Removed from Cart", game.gameInfo.name);
    } else {
      addToCart(gameData);
      setIsInCart(true);
      console.log("Added to Cart", game.gameInfo.name);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!game || !game.gameInfo.name) return;

    const { userName, rating, comment } = newReview;

    if (!userName.trim()) {
      setFormError(t("error_name_empty"));
      return;
    }
    if (rating < 1 || rating > 5) {
      setFormError(t("error_invalid_rating"));
      return;
    }
    if (!comment.trim()) {
      setFormError(t("error_comment_empty"));
      return;
    }

    const review: Review = {
      gameTitle: game.gameInfo.name,
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
    };

    const storedReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    const updatedReviews = [...storedReviews, review];
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    setReviews((prev) => [...prev, review]);

    setNewReview({ userName: "", rating: 0, comment: "" });
    setFormError(null);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-neutral-600"
            }
          />
        ))}
      </div>
    );
  };

  const locale = i18n.language === "en" ? "en-US" : i18n.language === "ru" ? "ru-RU" : "uk-UA";

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-center text-lime-400 text-xl font-mono">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="flex items-center gap-3 text-white text-xl font-mono">
          <div className="w-2 h-2 bg-lime-500 animate-ping"></div>
          <span>{t("loading_data")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black mt-[160px] font-mono text-white py-12 px-4">
      <div className="max-w-4xl mx-auto mt-16 relative">
        <div className="absolute inset-0 -z-10 bg-lime-500/10 blur-3xl opacity-50"></div>

        <div className="border border-lime-500/30 rounded-lg p-6 bg-neutral-950/95 backdrop-blur-md transition-all duration-500 hover:border-lime-500/50">
          <h1
            className="text-3xl md:text-4xl font-bold text-lime-400 mb-8 text-center tracking-wider uppercase relative
              before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-lime-500/50
              before:transform before:transition-transform before:duration-300 hover:before:scale-x-105
              "
          >
            {game.gameInfo.name || t("unknown_game")}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group">
              <img
                src={game.gameInfo.thumb || "https://via.placeholder.com/300"}
                alt={game.gameInfo.name || t("game_image")}
                className="w-full rounded-md object-cover transition-transform duration-500 group-hover:brightness-110"
              />
              <div className="absolute inset-0 border-2 border-lime-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="flex flex-col justify-center space-y-4 text-sm tracking-wide">
              <div className="flex justify-between items-center py-2 border-b border-lime-500/20">
                <span className="text-lime-400">{t("price")}</span>
                <span className="text-2xl text-green-400 font-bold">
                  {game.gameInfo.salePrice || "N/A"} $
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-lime-500/20">
                <span className="text-lime-400">{t("retail_price")}</span>
                <span className="line-through text-neutral-600">
                  {game.gameInfo.retailPrice || "N/A"} $
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-lime-500/20">
                <span className="text-lime-400">{t("steam_rating")}</span>
                <span>{game.gameInfo.steamRatingText || "N/A"}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-lime-500/20">
                <span className="text-lime-400">{t("metacritic_score")}</span>
                <span>
                  {game.gameInfo.metacriticScore
                    ? `${game.gameInfo.metacriticScore}/100`
                    : "N/A"}
                </span>
              </div>

              <div className="flex flex-col space-y-3 mt-6">
                <button
                  onClick={handleAddToWishlist}
                  className={`block text-center bg-lime-500/10 border ${
                    isWishlisted ? "border-lime-400" : "border-lime-500"
                  } text-lime-400 font-semibold py-3 rounded-md
                    hover:bg-lime-500 hover:text-black transition-all duration-300 transform hover:scale-105`}
                >
                  {isWishlisted ? t("remove_from_wishlist") : t("add_to_wishlist")}
                </button>

                <button
                  onClick={handleAddToCart}
                  className={`block text-center bg-lime-500/10 border ${
                    isInCart ? "border-lime-400" : "border-lime-500"
                  } text-lime-400 font-semibold py-3 rounded-md
                    hover:bg-lime-500 hover:text-black transition-all duration-300 transform hover:scale-105`}
                >
                  {isInCart ? t("remove_from_cart") : t("add_to_cart")}
                </button>

                <a
                  href={`https://store.steampowered.com/app/${
                    game.gameInfo.steamAppID || ""
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-3 rounded-md
                    hover:bg-lime-500 hover:text-black transition-all duration-300 transform hover:scale-105"
                >
                  {t("view_on_steam")}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2
              className="text-2xl font-bold text-lime-400 mb-6 text-center tracking-wider relative
                before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-lime-500/50"
            >
              {t("user_reviews")}
            </h2>

            <div className="bg-neutral-900/50 border border-lime-500/30 rounded-md p-6 mb-8">
              <h3 className="text-lg text-lime-400 mb-4">{t("leave_review")}</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-lime-400 mb-1">
                    {t("review_name")}
                  </label>
                  <input
                    type="text"
                    value={newReview.userName}
                    onChange={(e) =>
                      setNewReview({ ...newReview, userName: e.target.value })
                    }
                    className="w-full p-2 bg-neutral-950/50 border border-lime-500/50 text-lime-400 rounded-md focus:outline-none focus:border-lime-500"
                    placeholder={t("enter_name_placeholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm text-lime-400 mb-1">
                    {t("rating")}
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setNewReview({ ...newReview, rating: star })
                        }
                        className={`p-1 ${
                          star <= newReview.rating
                            ? "text-yellow-400"
                            : "text-neutral-600"
                        }`}
                      >
                        <Star
                          size={20}
                          className={
                            star <= newReview.rating ? "fill-yellow-400" : ""
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-lime-400 mb-1">
                    {t("comment")}
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    className="w-full p-2 bg-neutral-950/50 border border-lime-500/50 text-lime-400 rounded-md focus:outline-none focus:border-lime-500"
                    placeholder={t("enter_comment_placeholder")}
                    rows={4}
                  />
                </div>

                {formError && (
                  <p className="text-red-500 text-sm">{formError}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-md
                    hover:bg-lime-500 hover:text-black transition-all duration-300 transform hover:scale-105"
                >
                  {t("submit_review")}
                </button>
              </form>
            </div>

            <div>
              {reviews.length === 0 ? (
                <p className="text-center text-neutral-500">
                  {t("no_reviews")}
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div
                      key={`${review.gameTitle}-${review.userName}-${index}`}
                      className="bg-neutral-900/50 border border-lime-500/20 rounded-md p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lime-400 font-semibold">
                          {review.userName}
                        </span>
                        <span className="text-neutral-500 text-sm">
                          {new Date(review.timestamp).toLocaleDateString(locale, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="mb-2">{renderStars(review.rating)}</div>
                      <p className="text-neutral-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePage;