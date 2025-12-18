import { useState, useEffect } from "react";
import { Search, X, Menu, ChevronDown, ShoppingCart } from "react-feather";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "./CartContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function Header() {
  const [inputValue, setInputValue] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { t, i18n } = useTranslation();
  const { userSettings } = useAuth();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { currentUser, userProfile, logout } = useAuth();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (userSettings?.language) {
      i18n.changeLanguage(userSettings.language);
    }
  }, [userSettings, i18n]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (inputValue) {
        newParams.set("search", inputValue);
      } else {
        newParams.delete("search");
      }
      setSearchParams(newParams);
    }, 500);

    return () => clearTimeout(timeout);
  }, [inputValue, searchParams, setSearchParams]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleLogout = async () => {
    console.log("Stage 33: Header logout initiated");
    try {
      await logout();
      toggleMenu();
      navigate("/");
      console.log("Stage 34: Header logout successful");
    } catch (err: any) {
      console.error("Stage 35: Header logout error:", err.message);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-20 bg-neutral-950 font-mono text-white border-b border-lime-500/30">
      <div className="flex justify-end px-6 py-2">
        {currentUser ? (
          <div
            className="group flex items-center gap-2 bg-neutral-900/50 border border-lime-500/50 px-4 py-2 rounded-sm cursor-pointer
              hover:bg-lime-500/20 hover:border-lime-500 transition-all duration-300"
            onClick={toggleMenu}
          >
            <img
              src={userProfile?.avatar || "../src/assets/avatar.png"}
              alt="Avatar"
              className="size-6 rounded-full border border-lime-500/50"
            />
            <span className="text-lime-400 text-sm tracking-wide uppercase">
              {userProfile?.displayName || t("user")}
            </span>
            <ChevronDown className="text-lime-400 size-4 group-hover:rotate-180 transition-transform duration-300" />
          </div>
        ) : (
          <div className="flex gap-4">
            <NavLink
              to="/login"
              className="bg-neutral-900/50 border border-lime-500/50 text-lime-400 text-sm px-4 py-2 rounded-sm uppercase tracking-wide
                hover:bg-lime-500 hover:text-black transition-all duration-300"
            >
              {t("login")}
            </NavLink>
            <NavLink
              to="/register"
              className="bg-neutral-900/50 border border-lime-500/50 text-lime-400 text-sm px-4 py-2 rounded-sm uppercase tracking-wide
                hover:bg-lime-500 hover:text-black transition-all duration-300"
            >
              {t("register")}
            </NavLink>
          </div>
        )}

        {isMenuOpen && currentUser && (
          <div className="absolute top-12 right-6 bg-neutral-950/90 border border-lime-500/50 rounded-sm shadow-lg w-48 py-2 mt-2 z-20 backdrop-blur-md">
            <NavLink
              to="/profile"
              className="block px-4 py-2 text-lime-400 text-sm uppercase tracking-wide hover:bg-lime-500/20 transition-all duration-300"
              onClick={toggleMenu}
            >
              {t("profile")}
            </NavLink>
            <NavLink
              to="/settings"
              className="block px-4 py-2 text-lime-400 text-sm uppercase tracking-wide hover:bg-lime-500/20 transition-all duration-300"
              onClick={toggleMenu}
            >
              {t("profile_settings")}
            </NavLink>
            <button
              className="block w-full text-left px-4 py-2 text-red-500 text-sm uppercase tracking-wide hover:bg-lime-500/20 transition-all duration-300"
              onClick={handleLogout}
            >
              {t("logout")}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <NavLink to="/" className="flex items-center gap-2">
          <img
            src="../src/assets/logo.png"
            alt="Logo"
            className="size-10 border border-lime-500/50 rounded-sm"
          />
          <div className="text-xl tracking-wide uppercase">
            GAME <span className="text-lime-400 font-bold">VAULT</span>
          </div>
        </NavLink>

        <div className="flex-grow max-w-md mx-4 relative">
          <input
            type="text"
            placeholder={t("search_placeholder")}
            value={inputValue}
            aria-label="Пошук ігор"
            onChange={handleSearchChange}
            className="w-full px-4 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 text-sm rounded-sm
              focus:outline-none focus:border-lime-500 placeholder-neutral-500 uppercase tracking-wide transition-all duration-300"
          />
          <Search className="absolute right-3 top-2.5 text-lime-400 size-5 hover:text-lime-500 cursor-pointer transition-colors duration-300" />
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <NavLink
            to="/store"
            className="text-lime-400 text-sm uppercase tracking-wide hover:text-lime-500 transition-colors duration-300"
          >
            {t("store")}
          </NavLink>
          <NavLink
            to="/library"
            className="text-lime-400 text-sm uppercase tracking-wide hover:text-lime-500 transition-colors duration-300"
          >
            {t("library")}
          </NavLink>
          <NavLink
            to="/friends"
            className="text-lime-400 text-sm uppercase tracking-wide hover:text-lime-500 transition-colors duration-300"
          >
            {t("friends")}
          </NavLink>
          <NavLink
            to="/sales"
            className="text-lime-400 text-sm uppercase tracking-wide hover:text-lime-500 transition-colors duration-300"
          >
            {t("sales")}
          </NavLink>
        </div>

        <button className="lg:hidden text-lime-400" aria-label="Відкрити меню" onClick={toggleNav}>
          {isNavOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isNavOpen && (
        <div className="fixed inset-0 bg-neutral-950/95 text-white z-30 flex flex-col items-center justify-center space-y-8 backdrop-blur-md">
          <button
            className="absolute top-5 right-5 text-lime-400"
            onClick={toggleNav}
          >
            <X size={30} />
          </button>
          <NavLink
            to="/store"
            className="text-2xl text-lime-400 uppercase tracking-wide hover:text-lime-500 transition-colors duration-300"
            onClick={toggleNav}
          >
            {t("store")}
          </NavLink>
          <NavLink
            to="/library"
            className="text-2xl text-lime-400 uppercase tracking-wide hover:text-lime-500 transition-colors duration-300"
            onClick={toggleNav}
          >
            {t("library")}
          </NavLink>
          <NavLink
            to="/friends"
            className="text-2xl text-lime-400 uppercase tracking-wide hover:text-lime-500 transition-colors duration-300"
            onClick={toggleNav}
          >
            {t("friends")}
          </NavLink>
          <NavLink
            to="/sales"
            className="text-2xl text-lime-400 uppercase tracking-wide hover:text-lime-500 transition-colors duration-300"
            onClick={toggleNav}
          >
            {t("sales")}
          </NavLink>
        </div>
      )}

      <div className="flex justify-end gap-4 px-6 py-3 border-t border-lime-500/20">
        <NavLink
          to="/wishlist"
          className="flex items-center gap-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 text-sm px-4 py-2 rounded-sm uppercase tracking-wide
            hover:bg-lime-500 hover:text-black transition-all duration-300 transform hover:scale-105"
        >
          {t("wishlist")}
        </NavLink>
        <NavLink
          to="/cart"
          className="relative flex items-center gap-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 text-sm px-4 py-2 rounded-sm uppercase tracking-wide
            hover:bg-lime-500 hover:text-black transition-all duration-300 transform hover:scale-105"
          onClick={handleCartClick}
        >
          <ShoppingCart size={16} />
          {t("cart")}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-lime-500 text-black text-xs rounded-full px-2 py-1">
              {cartCount}
            </span>
          )}
        </NavLink>
      </div>
    </header>
  );
}

export default Header;