import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import * as Yup from "yup";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required("Введіть ім’я")
      .min(2, "Ім’я має містити щонайменше 2 символи"),
    email: Yup.string()
      .email("Введіть коректний email")
      .required("Введіть email"),
    password: Yup.string()
      .min(8, "Пароль має бути не коротше 8 символів")
      .required("Введіть пароль"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Паролі не збігаються")
      .required("Підтвердіть пароль"),
    recaptchaToken: Yup.string()
      .nullable()
      .required("Будь ласка, підтвердіть, що ви не бот"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await validationSchema.validate(
        { name, email, password, confirmPassword, recaptchaToken },
        { abortEarly: false }
      );

      await register(name, email, password);
      navigate("/verify-email");
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const firstError = err.errors[0];
        setError(firstError);
      } else {
        const errorMessage = err instanceof Error ? err.message : "Помилка реєстрації";
        setError(errorMessage);
      }
    }
  };

  const handleRecaptchaError = () => {
    setError("Помилка завантаження reCAPTCHA. Вимкніть блокувальники реклами, перевірте підключення до мережі або спробуйте інший браузер.");
    setRecaptchaToken(null);
  };

  return (
    <div className="min-h-screen mt-[160px] bg-black font-mono text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-neutral-950/90 border border-lime-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(190,242,100,0.3)]">
        <h2 className="text-3xl font-bold text-lime-400 mb-6 text-center uppercase tracking-wider">
          Зареєструватися
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lime-400 text-sm uppercase mb-2">
              Ім’я
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 rounded-sm
                focus:outline-none focus:border-lime-500 placeholder-neutral-500 uppercase tracking-wide"
              placeholder="Введіть ім’я"
            />
          </div>
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
          <div>
            <label className="block text-lime-400 text-sm uppercase mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 rounded-sm
                focus:outline-none focus:border-lime-500 placeholder-neutral-500 uppercase tracking-wide"
              placeholder="Введіть пароль"
            />
          </div>
          <div>
            <label className="block text-lime-400 text-sm uppercase mb-2">
              Підтвердження пароля
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 rounded-sm
                focus:outline-none focus:border-lime-500 placeholder-neutral-500 uppercase tracking-wide"
              placeholder="Повторіть пароль"
            />
          </div>
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LffUSYrAAAAANrcbtWDSrMc_ZwEL1fdo_k5e04B"
              onChange={(token) => setRecaptchaToken(token)}
              onErrored={handleRecaptchaError}
              size="normal"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-sm
              hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
          >
            Зареєструватися
          </button>
        </form>
        <p className="text-neutral-300 text-center mt-4">
          Вже є акаунт?{" "}
          <Link to="/login" className="text-lime-400 hover:text-lime-500">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;