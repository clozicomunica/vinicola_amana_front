import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { useCartActions } from "../context/useCartActions";
import WineCard, { type Wine } from "./WineCard";
import { motion } from "framer-motion";
const API_URL = import.meta.env.VITE_API_URL;

type FeaturedWinesSectionProps = {
  setQuickViewProduct: (product: Wine | null) => void;
};

// Componentes internos

const Loading = () => (
  <div className="flex justify-center items-center py-12 md:py-20">
    <Loader2 className="h-10 w-10 animate-spin text-[#89764b] mb-4" />
    <span className="text-sm text-gray-600 italic font-oswald">
      Carregando nossos melhores vinhos...
    </span>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="text-center py-12 md:py-20">
    <p className="text-red-600 mb-6 text-base font-medium font-oswald">
      {message}
    </p>
    <button
      onClick={() => window.location.reload()}
      className="px-6 py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-medium uppercase text-sm font-oswald"
    >
      Tentar novamente
    </button>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12 md:py-20">
    <p className="text-gray-600 mb-6 text-base italic font-oswald">
      Nenhum vinho encontrado no momento.
    </p>
    <Link
      to="/vinhos"
      className="px-6 py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg inline-block font-medium uppercase text-sm font-oswald"
    >
      Descubra nossa coleção
    </Link>
  </div>
);

const NavButton = ({
  onClick,
  disabled,
  direction,
}: {
  onClick: () => void;
  disabled: boolean;
  direction: "left" | "right";
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`absolute top-1/2 -translate-y-1/2 bg-[#89764b]/80 hover:bg-[#89764b] text-white p-2 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md z-50 ${
      direction === "left"
        ? "left-0 sm:left-[-50px]"
        : "right-0 sm:right-[-50px]"
    }`}
    aria-label={direction === "left" ? "Vinho anterior" : "Próximo vinho"}
  >
    {direction === "left" ? (
      <ChevronLeft className="h-5 w-5" />
    ) : (
      <ChevronRight className="h-5 w-5" />
    )}
  </button>
);

const WineCarousel = ({
  wines,
  currentIndex,
  setCurrentIndex,
  setQuickViewProduct,
  addToCart,
}: {
  wines: Wine[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setQuickViewProduct: (product: Wine | null) => void;
  addToCart: (wine: Wine) => void;
}) => {
  const touchStartX = useRef<number | null>(null);

  const getSlidesPerView = useCallback(() => {
    if (window.innerWidth >= 1280) return 4;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }, []);

  const maxIndex = Math.max(0, wines.length - getSlidesPerView());

  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const handleTouchStart = (e: React.TouchEvent) =>
    (touchStartX.current = e.touches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    if (deltaX > 50) handleNext();
    if (deltaX < -50) handlePrev();
    touchStartX.current = null;
  };

  return (
    <div className="relative">
      <NavButton
        onClick={handlePrev}
        disabled={currentIndex === 0}
        direction="left"
      />
      <NavButton
        onClick={handleNext}
        disabled={currentIndex >= maxIndex}
        direction="right"
      />

      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            transform: `translateX(-${
              currentIndex * (100 / getSlidesPerView())
            }%)`,
          }}
          className="flex transition-transform duration-300 ease-in-out"
        >
          {wines.map((wine) => (
            <div
              key={wine.id}
              className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-2"
            >
              <div className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <WineCard
                  wine={wine}
                  setQuickViewProduct={setQuickViewProduct}
                  onAddToCart={addToCart}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente Principal

const FeaturedWinesSection = ({
  setQuickViewProduct,
}: FeaturedWinesSectionProps) => {
  const [featuredWines, setFeaturedWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useCartActions();

  useEffect(() => {
    const fetchWines = async () => {
      try {
        setLoading(true);
        setError(null);
        let allWines: Wine[] = [];
        let page = 1;
        const perPage = 10;

        while (allWines.length < 7) {
          const response = await fetch(
            `${API_URL}/api/products?per_page=${perPage}&published=true&page=${page}`
          );
          if (!response.ok)
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
          const data: Wine[] = await response.json();

          const filtered = data.filter((p) =>
            p.categories?.some(
              (c) =>
                c?.name?.pt?.toLowerCase().includes("vinho") ||
                c?.name?.en?.toLowerCase().includes("wine")
            )
          );

          allWines = [...allWines, ...filtered];
          if (data.length < perPage) break;
          page++;
        }

        setFeaturedWines(allWines.slice(0, 7));
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar os vinhos. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWines();
  }, []);

  return (
    <section className="py-8 md:py-20 lg:py-28 bg-[#d4d4d4]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black mb-3 md:mb-6 tracking-tight uppercase font-oswald">
            Nossos Vinhos
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-light px-2 font-oswald">
            Cada garrafa conta uma história única, criada com paixão e dedicação
            por nossos vinicultores.
          </p>
        </motion.div>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} />
        ) : featuredWines.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <WineCarousel
              wines={featuredWines}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              setQuickViewProduct={setQuickViewProduct}
              addToCart={addToCart}
            />

            <div className="text-center mt-12 md:mt-16 lg:mt-20">
              <Link
                to="/vinhos"
                className="inline-flex items-center px-6 py-3 md:px-10 md:py-4 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg font-medium tracking-wide uppercase text-sm font-oswald"
              >
                Explorar Todos os Nossos Produtos
                <ChevronRight className="ml-2 h-4 w-4 sm:ml-3 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedWinesSection;
