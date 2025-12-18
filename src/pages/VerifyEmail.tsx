import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sendEmailVerification } from "../init/firebase";

function VerifyEmail() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-black font-mono text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-neutral-950/90 border border-lime-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(190,242,100,0.3)]">
        <h2 className="text-3xl font-bold text-lime-400 mb-6 text-center uppercase tracking-wider">
          Підтвердження Email
        </h2>
        <p className="text-neutral-300 text-center mb-4">
          Ми надіслали лист із посиланням для підтвердження на {user?.email}. Будь ласка, перевірте вашу пошту та перейдіть за посиланням.
        </p>
        <p className="text-neutral-300 text-center mb-4">
          Не отримали лист? Перевірте папку "Спам" або{" "}
          <button
            className="text-lime-400 hover:text-lime-500"
            onClick={() => user && sendEmailVerification(user)}
          >
            надішліть ще раз
          </button>.
        </p>
        <button
          onClick={logout}
          className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm
            hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
        >
          Вийти
        </button>
        <p className="text-neutral-300 text-center mt-4">
          Вже підтвердили?{" "}
          <Link to="/login" className="text-lime-400 hover:text-lime-500">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;