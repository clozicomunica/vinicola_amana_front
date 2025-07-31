import { useEffect, useState } from "react";
import AboutSection from "../components/AboutSection";
import Hero from "../components/Hero";
import wineImage from "../assets/wine-bottle.jpg";
import {
  ShoppingCart,
  Eye,
  Loader2,
  Star,
  Heart,
  X,
  ChevronRight,
  Info,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCart } from "../context/useCart";
import { decodeHtmlEntities } from "../utils/htmlUtils";

type Wine = {
  id: number;
  name: {
    pt: string;
    en?: string;
  };
  description?: {
    pt?: string;
    en?: string;
  };
  images: {
    src: string;
    alt?: string;
  }[];
  categories: {
    id: number;
    name: {
      pt: string;
      en?: string;
    };
  }[];
  variants: {
    id: number;
    price: string;
    stock?: number;
  }[];
  rating?: number;
  year?: number;
  sku?: string;
  alcohol?: string;
  region?: string;
  awards?: string[];
};

const HomePage = () => {
  const [featuredWines, setFeaturedWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Wine | null>(null);
  const [isWishlist, setIsWishlist] = useState<Record<number, boolean>>({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchWines = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://vinicola-amana-back.onrender.com/api/products"
        );
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        const data: Wine[] = await response.json();

        const enhancedData = data
          .filter((product) =>
            product.categories.some(
              (category) =>
                category.name.pt.toLowerCase().includes("vinho") ||
                category.name.en?.toLowerCase().includes("wine")
            )
          )
          .slice(0, 4)
          .map((wine) => ({
            ...wine,
            rating: +(3.5 + Math.random() * 1.5).toFixed(1),
            year: new Date().getFullYear() - Math.floor(Math.random() * 10),
            alcohol: `${(12 + Math.random() * 4).toFixed(1)}%`,
            region: [
              "Vale dos Vinhedos",
              "Serra Gaúcha",
              "Vale do São Francisco",
              "Campanha",
            ][Math.floor(Math.random() * 4)],
            awards:
              Math.random() > 0.7 ? ["Melhor Vinho do Ano", "Gold Medal"] : [],
          }));

        setFeaturedWines(enhancedData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Erro ao buscar vinhos:", error);
          setError(error.message);
        } else {
          console.error("Erro desconhecido ao buscar vinhos:", error);
          setError("Erro ao carregar os vinhos. Tente novamente mais tarde.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWines();
  }, []);

  const handleAddToCart = (wine: Wine) => {
    if (!wine.variants[0]?.price) {
      toast.error("Produto indisponível para compra");
      return;
    }

    const cartItem = {
      id: wine.id,
      name: wine.name.pt,
      price: parseFloat(wine.variants[0].price),
      image: wine.images[0]?.src || wineImage,
      category: wine.categories[0]?.name.pt || "Vinho",
      quantity: 1,
      variantId: wine.variants[0]?.id,
    };

    addToCart(cartItem);

    toast.success(`${wine.name.pt} adicionado ao carrinho!`, {
      position: "bottom-right",
      style: {
        background: "#89764b",
        color: "#fff",
        borderRadius: "8px",
        padding: "16px 24px",
        fontFamily: "'Oswald', sans-serif",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#89764b",
      },
    });
  };

  const toggleWishlist = (wineId: number) => {
    setIsWishlist((prev) => {
      const newState = { ...prev, [wineId]: !prev[wineId] };
      toast.success(
        newState[wineId]
          ? "Adicionado à lista de desejos"
          : "Removido da lista de desejos",
        {
          position: "bottom-right",
          style: {
            fontFamily: "'Oswald', sans-serif",
            padding: "16px 24px",
          },
        }
      );
      return newState;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans antialiased">
      <Hero />

      {/* Featured Wines Section */}
      <section className="py-12 md:py-20 lg:py-28 bg-gradient-to-b from-[#f8f5f0] to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight">
              <span className="relative inline-block">
                <span className="relative z-10 font-oswald uppercase">
                  Nossos Vinhos Premiados
                </span>
                <span className="absolute bottom-0 left-0 w-full h-2 md:h-3 bg-[#89764b]/30 -z-0 transform -rotate-1"></span>
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-light px-2">
              Cada garrafa conta uma história única, criada com paixão e
              dedicação por nossos vinicultores.
            </p>
          </div>

          {/* Wine Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12 md:py-20">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-[#89764b] mb-3 md:mb-4" />
                <span className="text-sm md:text-base text-gray-600 font-oswald italic">
                  Carregando nossos melhores vinhos...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12 md:py-20">
              <p className="text-red-600 mb-4 md:mb-6 text-sm md:text-base font-medium font-oswald">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 md:px-8 md:py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-medium font-oswald uppercase text-sm"
              >
                Tentar novamente
              </button>
            </div>
          ) : featuredWines.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base font-oswald italic">
                Nenhum vinho encontrado no momento.
              </p>
              <Link
                to="/vinhos"
                className="px-6 py-2 md:px-8 md:py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg inline-block font-medium font-oswald uppercase text-sm"
              >
                Descubra nossa coleção
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {featuredWines.map((wine) => (
                  <div
                    key={wine.id}
                    className="group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-md md:hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1 md:hover:-translate-y-2"
                  >
                    {/* Image Container - Padronizado */}
                    <div className="relative aspect-square bg-white p-4 flex items-center justify-center">
                      <Link
                        to={`/vinho/${wine.id}`}
                        className="h-full w-full flex items-center justify-center p-2 md:p-4"
                      >
                        <img
                          src={wine.images[0]?.src || wineImage}
                          alt={wine.images[0]?.alt || wine.name.pt}
                          className="max-h-[180px] w-auto object-contain mix-blend-multiply"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = wineImage;
                            e.currentTarget.className =
                              "max-h-[180px] w-auto object-contain";
                          }}
                        />
                      </Link>

                      {/* Badges */}
                      <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col space-y-1 md:space-y-2 z-10">
                        {wine.variants[0]?.stock === 0 && (
                          <span className="bg-red-600 text-white text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-md font-medium tracking-wide font-oswald">
                            Esgotado
                          </span>
                        )}
                        {wine.rating && wine.rating >= 4.5 && (
                          <span className="bg-amber-600/90 text-white text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-md flex items-center backdrop-blur-sm font-oswald">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {wine.rating.toFixed(1)}
                          </span>
                        )}
                        {wine.year && (
                          <span className="bg-white/90 text-gray-800 text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-md font-medium font-oswald">
                            Safra {wine.year}
                          </span>
                        )}
                      </div>

                      {/* Wishlist button */}
                      <button
                        onClick={() => toggleWishlist(wine.id)}
                        className={`absolute top-2 right-2 md:top-4 md:right-4 z-10 p-1 md:p-2 rounded-full transition-all duration-300 ${
                          isWishlist[wine.id]
                            ? "bg-red-500 text-white shadow-md"
                            : "bg-white/90 text-gray-600 hover:bg-white shadow-sm"
                        }`}
                        aria-label={
                          isWishlist[wine.id]
                            ? "Remover dos favoritos"
                            : "Adicionar aos favoritos"
                        }
                      >
                        <Heart
                          className={`h-4 w-4 md:h-5 md:w-5 ${
                            isWishlist[wine.id] ? "fill-current" : ""
                          }`}
                        />
                      </button>

                      {/* Action Overlay */}
                      <div className="absolute inset-0 bg-black/5 md:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-2 md:gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewProduct(wine);
                          }}
                          className="p-2 md:p-3 bg-white/90 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 md:hover:scale-110 shadow-md cursor-pointer"
                          aria-label="Visualização rápida"
                        >
                          <Eye className="h-4 w-4 md:h-5 md:w-5 text-gray-800" />
                        </button>
                        {wine.variants[0]?.stock !== 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(wine);
                            }}
                            className="p-2 md:p-3 bg-[#89764b] text-white rounded-full hover:bg-[#756343] transition-all duration-300 transform hover:scale-105 md:hover:scale-110 shadow-md cursor-pointer"
                            aria-label="Adicionar ao carrinho"
                          >
                            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Wine Details */}
                    <div className="p-4 md:p-6 flex flex-col flex-grow">
                      <div className="mb-2 md:mb-4">
                        <Link to={`/vinho/${wine.id}`}>
                          <h3 className="text-lg md:text-xl text-gray-900 mb-1 md:mb-2 hover:text-[#89764b] transition-colors duration-300 line-clamp-1 font-oswald uppercase tracking-tight">
                            {wine.name.pt}
                          </h3>
                        </Link>
                        <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wider font-light font-oswald">
                          {wine.categories[0]?.name.pt || "Vinho"}
                        </p>
                      </div>

                      <p className="text-gray-700 mb-4 md:mb-6 line-clamp-2 min-h-[40px] text-xs md:text-sm leading-relaxed font-light">
                        {wine.description?.pt
                          ? decodeHtmlEntities(
                              wine.description.pt.replace(/<[^>]*>/g, "")
                            )
                          : "Descrição não disponível"}
                      </p>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-2 md:mb-4">
                          <div className="flex items-baseline gap-1 md:gap-2">
                            <span className="font-bold text-gray-900 text-lg md:text-xl font-oswald">
                              {wine.variants[0]?.price
                                ? `R$ ${parseFloat(wine.variants[0].price)
                                    .toFixed(2)
                                    .replace(".", ",")}`
                                : "---"}
                            </span>
                            {Math.random() > 0.5 && (
                              <span className="text-xs md:text-sm text-gray-500 line-through font-light">
                                R${" "}
                                {(
                                  parseFloat(wine.variants[0]?.price || "0") *
                                  1.2
                                )
                                  .toFixed(2)
                                  .replace(".", ",")}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToCart(wine)}
                          disabled={wine.variants[0]?.stock === 0}
                          className={`w-full py-2 px-3 md:py-3 md:px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 font-oswald uppercase text-xs md:text-sm ${
                            wine.variants[0]?.stock === 0
                              ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                              : "bg-[#89764b] hover:bg-[#756343] text-white hover:shadow-md"
                          }`}
                        >
                          <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                          {wine.variants[0]?.stock === 0
                            ? "Esgotado"
                            : "Adicionar"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center mt-12 md:mt-20">
                <Link
                  to="/vinhos"
                  className="inline-flex items-center px-6 py-3 md:px-10 md:py-4 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-medium tracking-wide uppercase text-xs md:text-sm font-oswald"
                >
                  Explorar Todos os Vinhos
                  <ChevronRight className="ml-2 h-4 w-4 md:ml-3 md:h-5 md:w-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-24">
        <AboutSection />
      </div>

      {/* Quick View Modal - Com imagens padronizadas */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex justify-center items-center p-2 sm:p-4 animate-fadeIn overflow-y-auto">
          <div
            className="bg-white rounded-xl md:rounded-3xl overflow-hidden w-full max-w-full md:max-w-6xl max-h-[95vh] md:max-h-[90vh] flex flex-col lg:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-6 md:right-6 z-10 bg-white/90 hover:bg-white rounded-full p-1 sm:p-2 shadow-lg transition-all hover:rotate-90"
              aria-label="Fechar visualização rápida"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-800" />
            </button>

            {/* Image Gallery - Padronizada */}
            <div className="lg:w-1/2 bg-white relative">
              <div className="h-64 sm:h-80 md:h-full flex flex-col">
                {/* Main Image */}
                <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-white">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={
                        quickViewProduct.images[activeImageIndex]?.src ||
                        wineImage
                      }
                      alt={
                        quickViewProduct.images[activeImageIndex]?.alt ||
                        quickViewProduct.name.pt
                      }
                      className="max-h-[300px] w-auto object-contain mix-blend-multiply"
                      onError={(e) => {
                        e.currentTarget.src = wineImage;
                      }}
                    />
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 p-3 sm:p-4 md:p-6 overflow-x-auto border-t border-gray-200">
                  {quickViewProduct.images.length > 0 ? (
                    quickViewProduct.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 flex-shrink-0 rounded-lg border-2 transition-all ${
                          activeImageIndex === index
                            ? "border-[#89764b] shadow-md"
                            : "border-transparent hover:border-gray-300"
                        } overflow-hidden bg-white`}
                      >
                        <img
                          src={img.src}
                          alt={img.alt || `Miniatura ${index + 1}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = wineImage;
                          }}
                        />
                      </button>
                    ))
                  ) : (
                    <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-400">Sem imagem</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {/* Header */}
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight font-oswald uppercase">
                    {quickViewProduct.name.pt}
                  </h2>
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    {quickViewProduct.rating && (
                      <div className="flex items-center gap-1 sm:gap-2 bg-amber-100 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 rounded-full">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-500 text-amber-500" />
                        <span className="font-medium text-amber-800 text-xs sm:text-sm font-oswald">
                          {quickViewProduct.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    <span className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider font-light font-oswald">
                      {quickViewProduct.categories[0]?.name.pt || "Vinho"}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 sm:gap-3 md:gap-4">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#89764b] font-oswald">
                    R${" "}
                    {parseFloat(quickViewProduct.variants[0]?.price || "0")
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                  {Math.random() > 0.5 && (
                    <span className="text-sm sm:text-lg text-gray-500 line-through font-light">
                      R${" "}
                      {(
                        parseFloat(quickViewProduct.variants[0]?.price || "0") *
                        1.2
                      )
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                  )}
                </div>

                {/* Availability */}
                <div
                  className={`py-2 px-3 sm:py-3 sm:px-4 md:py-3 md:px-5 rounded-lg text-xs sm:text-sm font-medium font-oswald ${
                    quickViewProduct.variants[0]?.stock === 0
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {quickViewProduct.variants[0]?.stock === 0
                    ? "Esgotado no momento"
                    : "Disponível para entrega"}
                </div>

                {/* Description */}
                <div className="prose max-w-none text-gray-700 leading-relaxed font-light text-sm sm:text-base">
                  <p>
                    {quickViewProduct.description?.pt
                      ? decodeHtmlEntities(
                          quickViewProduct.description.pt.replace(
                            /<[^>]*>/g,
                            ""
                          )
                        )
                      : "Descrição não disponível."}
                  </p>
                </div>

                {/* Technical Details */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  {quickViewProduct.year && (
                    <div className="bg-gray-50 p-2 sm:p-3 md:p-4 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-oswald">
                        Safra
                      </p>
                      <p className="font-medium font-oswald text-sm sm:text-base">
                        {quickViewProduct.year}
                      </p>
                    </div>
                  )}
                  {quickViewProduct.alcohol && (
                    <div className="bg-gray-50 p-2 sm:p-3 md:p-4 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-oswald">
                        Teor Alcoólico
                      </p>
                      <p className="font-medium font-oswald text-sm sm:text-base">
                        {quickViewProduct.alcohol}
                      </p>
                    </div>
                  )}
                  {quickViewProduct.region && (
                    <div className="bg-gray-50 p-2 sm:p-3 md:p-4 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-oswald">
                        Região
                      </p>
                      <p className="font-medium font-oswald text-sm sm:text-base">
                        {quickViewProduct.region}
                      </p>
                    </div>
                  )}
                  {quickViewProduct.sku && (
                    <div className="bg-gray-50 p-2 sm:p-3 md:p-4 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-oswald">
                        Código
                      </p>
                      <p className="font-medium font-oswald text-sm sm:text-base">
                        {quickViewProduct.sku}
                      </p>
                    </div>
                  )}
                </div>

                {/* Awards */}
                {quickViewProduct.awards &&
                  quickViewProduct.awards.length > 0 && (
                    <div className="space-y-2 sm:space-y-3">
                      <h4 className="font-medium flex items-center gap-1 sm:gap-2 text-gray-900 font-oswald text-sm sm:text-base">
                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                        Prêmios e Reconhecimentos
                      </h4>
                      <ul className="space-y-1 sm:space-y-2">
                        {quickViewProduct.awards.map((award, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm"
                          >
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>{award}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 pt-4 sm:pt-5 md:pt-6">
                  <button
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    disabled={quickViewProduct.variants[0]?.stock === 0}
                    className={`py-2 px-4 sm:py-3 sm:px-5 md:py-4 md:px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-oswald uppercase text-xs sm:text-sm ${
                      quickViewProduct.variants[0]?.stock === 0
                        ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                        : "bg-[#89764b] hover:bg-[#756343] text-white hover:shadow-md"
                    }`}
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    Adicionar ao Carrinho
                  </button>
                  <Link
                    to={`/produto/${quickViewProduct.id}`}
                    className="py-2 px-4 sm:py-3 sm:px-5 md:py-4 md:px-6 rounded-lg border-2 border-[#89764b] text-[#89764b] hover:bg-[#89764b]/5 transition-all duration-300 flex items-center justify-center gap-2 font-oswald uppercase text-xs sm:text-sm"
                    onClick={() => setQuickViewProduct(null)}
                  >
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
