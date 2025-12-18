import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Введіть коректний email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateEmail()) return;
    try {
      await resetPassword(email);
      setSuccess("Лист для відновлення пароля надіслано. Перевірте вашу пошту.");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Помилка відновлення пароля");
    }
  };

  return (
    <div className="min-h-screen bg-black font-mono text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-neutral-950/90 border border-lime-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(190,242,100,0.3)]">
        <h2 className="text-3xl font-bold text-lime-400 mb-6 text-center uppercase tracking-wider">
          Відновлення пароля
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-lime-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lime-400 text-sm uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 rounded-sm
                focus:outline-none focus:border-lime-500 placeholder-neutral-500 uppercase tracking-wide"
              placeholder="Введіть email"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm
              hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
          >
            Надіслати лист
          </button>
        </form>
        <p className="text-neutral-300 text-center mt-4">
          Повернутися до{" "}
          <Link to="/login" className="text-lime-400 hover:text-lime-500">
            входу
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
