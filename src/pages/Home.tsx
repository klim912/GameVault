import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCube, Pagination } from "swiper/modules";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Star, ArrowRight, Shield, Rocket, Gamepad } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cube";

interface Game {
  dealID: string;
  title: string;
  salePrice: string;
  thumb: string;
  metacriticScore: string;
  savings: string;
}

const fetchGamesByRating = async (): Promise<Game[]> => {
  const response = await fetch(
    "https://www.cheapshark.com/api/1.0/deals?storeID=1&sortBy=Metacritic"
  );
  if (!response.ok) {
    throw new Error("error_loading_games_by_rating");
  }
  return response.json();
};

const fetchGamesBySales = async (): Promise<Game[]> => {
  const response = await fetch(
    "https://www.cheapshark.com/api/1.0/deals?storeID=1&sortBy=Savings"
  );
  if (!response.ok) {
    throw new Error("error_loading_games_by_sales");
  }
  return response.json();
};

const AnimatedSection: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="mb-12"
    >
      {children}
    </motion.div>
  );
};

function Home() {
  const { t, i18n } = useTranslation();
  const { userSettings } = useAuth();

  useEffect(() => {
    if (userSettings?.language) {
      i18n.changeLanguage(userSettings.language);
    }
  }, [userSettings, i18n]);

  const {
    data: gamesByRating,
    error: ratingError,
    isLoading: ratingLoading,
  } = useQuery<Game[]>({
    queryKey: ["gamesByRating"],
    queryFn: fetchGamesByRating,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: gamesBySales,
    error: salesError,
    isLoading: salesLoading,
  } = useQuery<Game[]>({
    queryKey: ["gamesBySales"],
    queryFn: fetchGamesBySales,
    staleTime: 5 * 60 * 1000,
  });

  const bannerImages = [
    {
      src: "/src/assets/R.jpg",
      title: t("banner_1_title"),
      cta: t("banner_1_cta"),
      link: "/store",
    },
    {
      src: "/src/assets/R.jpg",
      title: t("banner_2_title"),
      cta: t("banner_2_cta"),
      link: "/sales",
    },
    {
      src: "/src/assets/R.jpg",
      title: t("banner_3_title"),
      cta: t("banner_3_cta"),
      link: "/sales",
    },
  ];

  return (
    <div className="min-h-screen bg-black font-mono text-white py-12 px-4">
      <div className="max-w-6xl mx-auto mt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-14"
        >
          <Swiper
            modules={[Navigation, Autoplay, EffectCube, Pagination]}
            spaceBetween={0}
            pagination={{ clickable: true }}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            effect="cube"
            cubeEffect={{
              shadow: true,
              slideShadows: true,
              shadowOffset: 20,
              shadowScale: 0.94,
            }}
            className="mySwiper rounded-lg overflow-hidden"
          >
            {bannerImages.map((banner, index) => (
              <SwiperSlide key={index}>
                <div className="relative">
                  <img
                    loading="lazy"
                    src={banner.src}
                    alt={banner.title}
                    className="w-full h-[500px] object-cover brightness-25"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-3xl md:text-5xl font-bold text-lime-400 uppercase tracking-wider"
                    >
                      {banner.title}
                    </motion.h2>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <Link
                        to={banner.link}
                        className="mt-4 inline-block bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 px-6 rounded-md
                          hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
                      >
                        {banner.cta}
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        <AnimatedSection delay={0.6}>
          <h2
            className="text-3xl md:text-4xl font-bold text-lime-400 mb-10 text-center tracking-wider uppercase relative
            before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-lime-500/50"
          >
            {t("sales_section_title")}
          </h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="bg-neutral-950/50 border border-lime-500/30 rounded-lg p-6 text-center "
          >
            <h3 className="text-2xl font-semibold text-lime-400 mb-4">
              {t("fall_sale_title")}
            </h3>
            <p className="text-neutral-300 mb-4">
              {t("fall_sale_description")}
            </p>
            <Link
              to="/sales"
              className="inline-block bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 px-6 rounded-md
                hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
            >
              {t("view_sales_cta")}
            </Link>
          </motion.div>
        </AnimatedSection>

        <section className="max-w-7xl mx-auto px-4 py-16 space-y-24 mb-20 ">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-10"
          >
            <motion.div
              whileHover={{ scale: 1.15, boxShadow: "0 0 20px #84cc16" }}
              className="w-24 h-24 flex items-center justify-center bg-zinc-800 rounded-full transition duration-300"
            >
              <Gamepad size={48} className="text-lime-400" />
            </motion.div>
            <div className="text-lime-400 text-center md:text-left max-w-xl">
              <h3 className="text-2xl font-semibold mb-3">{t("play_without_limits_title")}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {t("play_without_limits_description")}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row-reverse items-center gap-10"
          >
            <motion.div
              whileHover={{ scale: 1.15, boxShadow: "0 0 20px #84cc16" }}
              className="w-24 h-24 flex items-center justify-center bg-zinc-800 rounded-full transition duration-300"
            >
              <Rocket size={48} className="text-lime-400" />
            </motion.div>
            <div className="text-lime-400 text-center md:text-left max-w-xl">
              <h3 className="text-2xl font-semibold mb-3">{t("fast_downloads_title")}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {t("fast_downloads_description")}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-10"
          >
            <motion.div
              whileHover={{ scale: 1.15, boxShadow: "0 0 20px #84cc16" }}
              className="w-24 h-24 flex items-center justify-center bg-zinc-800 rounded-full transition duration-300"
            >
              <Shield size={48} className="text-lime-400" />
            </motion.div>
            <div className="text-lime-400 text-center md:text-left max-w-xl">
              <h3 className="text-2xl font-semibold mb-3">{t("secure_title")}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {t("secure_description")}
              </p>
            </div>
          </motion.div>
        </section>

        <AnimatedSection>
          <h2
            className="text-3xl md:text-4xl font-bold text-lime-400 mb-10 text-center tracking-wider uppercase relative
            before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-lime-500/50"
          >
            {t("top_rated_games_title")}
          </h2>
          {ratingLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="flex items-center gap-3 text-lime-400 text-xl font-mono">
                <div className="w-2 h-2 bg-lime-500 animate-ping"></div>
                <span>{t("loading")}</span>
              </div>
            </div>
          )}
          {ratingError && (
            <div className="text-center text-red-500 text-lg font-mono">
              <p>{t((ratingError as Error).message)}</p>
            </div>
          )}
          {gamesByRating && (
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="mySwiper"
            >
              {gamesByRating.map((game) => (
                <SwiperSlide key={game.dealID}>
                  <div className="bg-neutral-950/50 border border-lime-500/30 rounded-lg p-4 hover:scale-98 transition-all duration-300">
                    <Link to={`/game/${game.dealID}`}>
                      <div className="grid place-content-center">
                        <img
                          loading="lazy"
                          src={game.thumb || "https://via.placeholder.com/300"}
                          alt={game.title}
                          className="h-16 object-cover rounded-md mb-4 hover:brightness-110 transition-all duration-300"
                        />
                      </div>
                    </Link>
                    <div className="space-y-2">
                      <Link to={`/game/${game.dealID}`}>
                        <h3 className="text-lg font-semibold text-lime-400 truncate">
                          {game.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2">
                        <Star
                          size={16}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="text-neutral-300 text-sm">
                          {game.metacriticScore
                            ? `${game.metacriticScore}/100`
                            : t("na")}
                        </span>
                      </div>
                      <p className="text-green-400 text-lg font-bold">
                        ${game.salePrice || t("na")}
                      </p>
                      <Link
                        to={`/game/${game.dealID}`}
                        className="block text-center bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-md
                          hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
                      >
                        {t("view_game_cta")}
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <h2
            className="text-3xl md:text-4xl font-bold text-lime-400 mb-10 mt-20 text-center tracking-wider uppercase relative
            before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-lime-500/50"
          >
            {t("why_choose_us_title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-30">
            {[
              {
                title: t("wide_selection_title"),
                description: t("wide_selection_description"),
                icon: <Star size={24} className="text-lime-400" />,
              },
              {
                title: t("best_prices_title"),
                description: t("best_prices_description"),
                icon: <ArrowRight size={24} className="text-lime-400" />,
              },
              {
                title: t("instant_delivery_title"),
                description: t("instant_delivery_description"),
                icon: <Star size={24} className="text-lime-400" />,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="bg-neutral-950/50 border border-lime-500/30 rounded-lg p-6 text-center"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-lime-400 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-300 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h2
            className="text-3xl md:text-4xl font-bold text-lime-400 mb-10 text-center tracking-wider uppercase relative
            before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-lime-500/50"
          >
            {t("top_selling_games_title")}
          </h2>
          {salesLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="flex items-center gap-3 text-lime-400 text-xl font-mono">
                <div className="w-2 h-2 bg-lime-500 animate-ping"></div>
                <span>{t("loading")}</span>
              </div>
            </div>
          )}
          {salesError && (
            <div className="text-center text-red-500 text-lg font-mono">
              <p>{t((salesError as Error).message)}</p>
            </div>
          )}
          {gamesBySales && (
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="mySwiper"
            >
              {gamesBySales.map((game) => (
                <SwiperSlide key={game.dealID}>
                  <div className="bg-neutral-950/50 border border-lime-500/30 rounded-lg p-4 hover:scale-99 transition-all duration-300">
                    <Link to={`/game/${game.dealID}`}>
                      <div className="grid place-content-center">
                        <img
                          loading="lazy"
                          src={game.thumb || "https://via.placeholder.com/300"}
                          alt={game.title}
                          className="h-16 object-cover rounded-md mb-4 hover:brightness-110 transition-all duration-300"
                        />
                      </div>
                    </Link>
                    <div className="space-y-2">
                      <Link to={`/game/${game.dealID}`}>
                        <h3 className="text-lg font-semibold text-lime-400 truncate">
                          {game.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2">
                        <Star
                          size={16}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="text-neutral-300 text-sm">
                          {game.metacriticScore
                            ? `${game.metacriticScore}/100`
                            : t("na")}
                        </span>
                      </div>
                      <p className="text-green-400 text-lg font-bold">
                        ${game.salePrice || t("na")}
                      </p>
                      <Link
                        to={`/game/${game.dealID}`}
                        className="block text-center bg-lime-500/10 border border-lime-500 text-lime-400 font-semibold py-2 rounded-md
                          hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-wide"
                      >
                        {t("view_game_cta")}
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </AnimatedSection>
      </div>

      <style jsx>{`
        .swiper-button-prev,
        .swiper-button-next {
          color: #bef264; /* lime-400 */
          background: rgba(17, 24, 39, 0.8); /* neutral-950 */
          border: 1px solid rgba(190, 242, 100, 0.3);
          border-radius: 0.25rem;
          padding: 0.5rem;
          width: 2.5rem;
          height: 2.5rem;
          transition: all 0.3s ease;
        }
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background: #bef264; /* lime-400 */
          color: #000;
          border-color: #bef264;
        }
        .swiper-button-prev::after,
        .swiper-button-next::after {
          font-size: 1.25rem;
        }
        .swiper-pagination-bullet {
          background-color: #84cc16; /* Lime-400 */
          opacity: 0.6;
        }
        .swiper-pagination-bullet-active {
          background-color: #a3e635; /* Lime-300 */
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

export default Home;