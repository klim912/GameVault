import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Store from "../pages/Store";
import Library from "../pages/Library";
import Friends from "../pages/Friends";
import Sales from "../pages/Sales";
import WishList from "../pages/WishList";
import CartPage from "../pages/CartPage";
import NotFound from "../pages/NotFound";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfUse from "../pages/TermsOfUse";
import FAQ from "../pages/FAQ";
import SupportPage from "../pages/SupportPage";
import GamePage from "../pages/GamePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import Profile from "../pages/Profile";
import SteamCallback from "../pages/SteamCallback";
import ResetPassword from "../pages/ResetPassword";
import Settings from "../pages/Settings";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/store" element={<Store />} />
    <Route path="/library" element={<Library />} />
    <Route path="/friends" element={<Friends />} />
    <Route path="/sales" element={<Sales />} />
    <Route path="/wishlist" element={<WishList />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-use" element={<TermsOfUse />} />
    <Route path="/faq" element={<FAQ />} />
    <Route path="/support" element={<SupportPage />} />
    <Route path="/game/:id" element={<GamePage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/verify-email" element={<VerifyEmail />} />
    <Route path="/auth/steam/callback" element={<SteamCallback />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;