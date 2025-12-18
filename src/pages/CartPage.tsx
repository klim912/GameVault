import { useEffect } from "react";
import { useCart } from "../components/CartContext";
import { Trash2 } from "react-feather";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

function CartPage() {
  const { cartItems, setCartItems, removeFromCart } = useCart();
  const { t, i18n } = useTranslation();
  const { userSettings } = useAuth();

  useEffect(() => {
    if (userSettings?.language) {
      i18n.changeLanguage(userSettings.language);
    }
  }, [userSettings, i18n]);

  const updateQuantity = (title: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.title === title ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cartItems
      .reduce(
        (total, item) => total + Number(item.salePrice) * item.quantity,
        0
      )
      .toFixed(2);
  };

  return (
    <div className="min-h-screen bg-black font-mono text-white py-12 px-4 mt-10">
      <div className="max-w-6xl mx-auto mt-16">
        <h2
          className="text-3xl md:text-4xl font-bold text-lime-400 mb-10 text-center tracking-wider relative
            before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-lime-500/50
            before:transform before:transition-transform before:duration-300 hover:before:scale-x-110"
        >
          {t("cart_title")}
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-lg text-neutral-500 tracking-wide">
            {t("cart_empty")}
          </p>
        ) : (
          <>
            <div className="bg-neutral-950/90 border border-lime-500/30 rounded-md overflow-hidden backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-neutral-900/50 border-b border-lime-500/20">
                    <tr>
                      <th className="py-3 px-4 text-left text-lime-400 text-sm tracking-wide">
                        {t("cart_image")}
                      </th>
                      <th className="py-3 px-4 text-left text-lime-400 text-sm tracking-wide">
                        {t("cart_game")}
                      </th>
                      <th className="py-3 px-4 text-left text-lime-400 text-sm tracking-wide">
                        {t("cart_quantity")}
                      </th>
                      <th className="py-3 px-4 text-left text-lime-400 text-sm tracking-wide">
                        {t("cart_price")}
                      </th>
                      <th className="py-3 px-4 text-left text-lime-400 text-sm tracking-wide">
                        {t("cart_total_price")}
                      </th>
                      <th className="py-3 px-4 text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr
                        key={item.title}
                        className="border-b border-lime-500/10 hover:bg-neutral-900/50 transition-colors duration-300"
                      >
                        <td className="py-4 px-4">
                          <img
                            src={item.thumb || "https://via.placeholder.com/64"}
                            alt={t("game_image")}
                            loading="lazy"
                            className="w-16 h-16 object-contain rounded-sm border border-lime-500/20"
                          />
                        </td>
                        <td className="py-4 px-4 text-sm text-lime-400 line-clamp-2">
                          {item.title || t("unknown_game")}
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            onChange={(e) =>
                              updateQuantity(
                                item.title,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 p-1 bg-neutral-900/50 border border-lime-500/50 text-lime-400 text-center rounded-sm focus:outline-none focus:border-lime-500 transition-colors duration-300"
                          />
                        </td>
                        <td className="py-4 px-4 text-sm text-green-400">
                          ${item.salePrice}
                        </td>
                        <td className="py-4 px-4 text-sm text-green-400">
                          ${(Number(item.salePrice) * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => removeFromCart(item.title)}
                            className="bg-neutral-900/50 border border-lime-500/50 text-lime-400 p-2 rounded-sm
                              hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 transform hover:scale-110"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right p-4 text-xl md:text-2xl font-bold text-green-400 border-t border-lime-500/20">
                {t("cart_total")}: ${calculateTotal()}
              </div>
            </div>
            <div className="mt-6 text-right">
              <Link
                to="/checkout"
                className="inline-block bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-3 px-6 rounded-md
                  hover:bg-lime-500 hover:text-black transition-all duration-300 transform hover:scale-105"
              >
                {t("proceed_to_checkout")}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;