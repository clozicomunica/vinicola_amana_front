import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  ChevronRight,
  Wine,
  Utensils,
  ZoomIn,
  Heart,
  Share2,
} from "lucide-react";
import { useCart } from "../context/useCart";

interface Variant {
  id: number;
  price: string;
  compare_at_price?: string;
}

interface Wine {
  id: number;
  name: { pt: string };
  variants: Variant[];
  images: { src: string; alt?: string }[];
  categories: { name: { pt: string } }[];
  description: { pt: string };
  created_at: string;
  region?: string;
  alcohol?: string;
  rating?: number;
  pairing?: string;
}

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [wine, setWine] = useState<Wine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<Wine[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);

  const formatPrice = (price: string) =>
    parseFloat(price).toFixed(2).replace(".", ",");

  const handleAddToCart = useCallback(() => {
    if (!wine || wine.variants.length === 0) return;

    addToCart({
      id: wine.id,
      name: wine.name.pt,
      price: parseFloat(wine.variants[0].price),
      quantity: 1,
      image: wine.images[0]?.src || "/placeholder-wine.jpg",
      category: wine.categories[0]?.name.pt || "Vinho",
      variant_id: wine.variants[0].id,
    });
  }, [addToCart, wine]);

  useEffect(() => {
    if (!id) {
      setError("ID do produto não informado");
      setLoading(false);
      return;
    }

    const fetchWineDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://vinicola-amana-back.onrender.com/api/products/${id}`
        );

        if (!response.ok) throw new Error("Produto não encontrado");

        const data = await response.json();

        const enhancedData = {
          ...data,
          rating: data.rating || +(4.0 + Math.random() * 1.0).toFixed(1),
          alcohol: data.alcohol || `${(12 + Math.random() * 4).toFixed(1)}%`,
          region:
            data.region ||
            ["Vale dos Vinhedos", "Serra Gaúcha", "Vale do São Francisco"][
              Math.floor(Math.random() * 3)
            ],
          pairing:
            data.pairing ||
            [
              "Carnes vermelhas grelhadas",
              "Queijos amarelos",
              "Massas com molhos encorpados",
              "Chocolates amargos",
              "Frutos do mar",
            ][Math.floor(Math.random() * 5)],
        };

        setWine(enhancedData);

        const categoryName = enhancedData.categories[0]?.name.pt || "";
        if (categoryName) {
          const similarResponse = await fetch(
            `https://vinicola-amana-back.onrender.com/api/products/${enhancedData.id}/similares`
          );
          if (similarResponse.ok) {
            const similarData = await similarResponse.json();
            setSimilarProducts(
              similarData
                .filter((item: Wine) => item.id !== enhancedData.id)
                .slice(0, 4)
            );
          }
        } else {
          setSimilarProducts([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setWine(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWineDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f8f5f0] font-['Oswald']">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#89764b] border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8f5f0] p-4 sm:p-6 text-center font-['Oswald']">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold text-[#9a3324] mb-4">
            Ocorreu um erro
          </h2>
          <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </p>
          <Link
            to="/vinhos"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all text-sm sm:text-base"
            aria-label="Voltar para a loja"
          >
            <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  if (!wine) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8f5f0] p-4 sm:p-6 text-center font-['Oswald']">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md">
          <Wine className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-[#89764b] mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            Produto não encontrado
          </h2>
          <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
            O vinho que você está procurando não está disponível no momento.
          </p>
          <Link
            to="/vinhos"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all text-sm sm:text-base"
            aria-label="Explorar nossa coleção"
          >
            <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Explorar nossa coleção
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f5f0] min-h-screen font-['Oswald']">
      {/* Voltar */}
      <div className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-16">
        <motion.div whileHover={{ x: -5 }}>
          <Link
            to="/vinhos"
            className="inline-flex items-center text-[#89764b] hover:text-[#756343] transition-all text-sm sm:text-base"
            aria-label="Voltar para a loja"
          >
            <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span>Voltar para a loja</span>
          </Link>
        </motion.div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Galeria de Imagens */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            {/* Imagem Principal com Zoom */}
            <div
              className="relative h-[300px] sm:h-[400px] lg:h-[500px] mb-4 sm:mb-6 bg-white rounded-lg overflow-hidden cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <img
                src={
                  wine.images[activeImageIndex]?.src || "/placeholder-wine.jpg"
                }
                alt={wine.images[activeImageIndex]?.alt || wine.name.pt}
                className={`absolute inset-0 w-full h-full object-contain transition-transform duration-300 ${
                  isZoomed ? "scale-150" : "scale-100"
                }`}
                style={{
                  mixBlendMode: "multiply",
                }}
              />

              {/* Overlay de Zoom */}
              {isZoomed && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="bg-white/80 p-2 rounded-full">
                    <ZoomIn className="h-5 w-5 sm:h-6 sm:w-6 text-[#89764b]" />
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  className="p-2 bg-white/80 rounded-full hover:bg-white transition-all shadow-md"
                  aria-label="Adicionar aos favoritos"
                >
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-[#89764b]" />
                </button>
                <button
                  className="p-2 bg-white/80 rounded-full hover:bg-white transition-all shadow-md"
                  aria-label="Compartilhar"
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#89764b]" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {wine.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {wine.images.map((img, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-white ${
                      activeImageIndex === index
                        ? "border-[#89764b]"
                        : "border-transparent hover:border-gray-200"
                    }`}
                    aria-label={`Selecionar imagem ${index + 1}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt || `Miniatura ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Segundo Botão de Compra */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full mt-4 sm:mt-6 py-3 sm:py-4 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base font-['Oswald']"
              aria-label="Adicionar ao carrinho"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              Adicionar ao Carrinho
            </motion.button>
          </div>

          {/* Detalhes do Produto */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 flex flex-col">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                {wine.rating !== undefined && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center bg-black px-2 sm:px-3 py-1 rounded-full"
                  >
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-[#89764b] text-[#89764b] mr-1" />
                    <span className="text-[#89764b] text-xs sm:text-sm font-medium font-['Oswald']">
                      {wine.rating.toFixed(1)}
                    </span>
                  </motion.div>
                )}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-xs sm:text-sm bg-black rounded-full text-[#89764b] py-1 px-2 sm:px-3 flex items-center font-medium font-['Oswald']"
                >
                  {wine.categories[0]?.name.pt || "Vinho"}
                </motion.span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2 sm:mb-3 font-['Oswald']"
              >
                {wine.name.pt}
              </motion.h1>

              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 flex-wrap">
                {wine.region && (
                  <span className="flex items-center font-['Oswald']">
                    <svg
                      className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-[#89764b]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {wine.region}
                  </span>
                )}
                {wine.alcohol && (
                  <span className="flex items-center font-['Oswald']">
                    <svg
                      className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-[#89764b]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                      />
                    </svg>
                    {wine.alcohol}
                  </span>
                )}
                {wine.pairing && (
                  <span className="flex items-center font-['Oswald']">
                    <Utensils className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-[#89764b]" />
                    {wine.pairing}
                  </span>
                )}
                {wine.created_at && (
                  <span className="flex items-center font-['Oswald']">
                    <svg
                      className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-[#89764b]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(wine.created_at).getFullYear()}
                  </span>
                )}
              </div>
            </div>

            {/* Preço */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex items-baseline gap-3 sm:gap-4 mb-2 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-[#89764b] font-['Oswald']">
                  R$ {formatPrice(wine.variants[0].price)}
                </span>
                {wine.variants[0]?.compare_at_price && (
                  <span className="text-base sm:text-lg text-gray-500 line-through font-['Oswald']">
                    R$ {formatPrice(wine.variants[0].compare_at_price)}
                  </span>
                )}
              </div>
              {wine.variants[0]?.compare_at_price && (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-block bg-[#89764b]/10 text-[#89764b] px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium font-['Oswald']"
                >
                  Economize R${" "}
                  {(
                    parseFloat(wine.variants[0].compare_at_price) -
                    parseFloat(wine.variants[0].price)
                  )
                    .toFixed(2)
                    .replace(".", ",")}
                </motion.span>
              )}
            </motion.div>

            {/* Descrição */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="prose max-w-none text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base font-['Oswald']"
              dangerouslySetInnerHTML={{ __html: wine.description.pt }}
            />

            {/* Botão de compra */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full py-3 sm:py-4 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base font-['Oswald']"
              aria-label="Adicionar ao carrinho"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              Adicionar ao Carrinho
            </motion.button>

            {/* Entrega e Harmonização */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-[#89764b] mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <p className="text-gray-800 font-medium font-['Oswald']">
                    Frete Grátis
                  </p>
                  <p className="text-gray-500 font-['Oswald']">
                    Para todo o Brasil
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-[#89764b] mt-0.5" />
                <div>
                  <p className="text-gray-800 font-medium font-['Oswald']">
                    Harmonização
                  </p>
                  <p className="text-gray-500 font-['Oswald']">
                    {wine.pairing || "Sugestões de acompanhamento"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Produtos Similares */}
        {similarProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 sm:mt-16"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 font-['Oswald']">
                Você também pode gostar
              </h2>
              <Link
                to="/vinhos"
                className="flex items-center text-[#89764b] hover:text-[#756343] font-medium text-sm sm:text-base font-['Oswald']"
                aria-label="Ver todos os produtos"
              >
                Ver todos <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 pb-4 sm:pb-0 scrollbar-hide">
              {similarProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0 w-60 sm:w-auto snap-center"
                  aria-label={`Produto similar: ${product.name.pt}`}
                >
                  <Link to={`/produto/${product.id}`} className="block">
                    <div className="relative h-48 sm:h-64 bg-white flex items-center justify-center p-4 sm:p-6">
                      <img
                        src={product.images[0]?.src || "/placeholder-wine.jpg"}
                        alt={product.images[0]?.alt || product.name.pt}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                        style={{
                          mixBlendMode: "multiply",
                        }}
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="font-medium text-gray-800 mb-1 line-clamp-1 text-sm sm:text-base font-['Oswald']">
                        {product.name.pt}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 font-['Oswald']">
                        {product.categories[0]?.name.pt || "Vinho"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#89764b] text-sm sm:text-base font-['Oswald']">
                          R$ {formatPrice(product.variants[0].price)}
                        </span>
                        {product.rating !== undefined && (
                          <div className="flex items-center text-xs sm:text-sm text-gray-500 font-['Oswald']">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-[#89764b] text-[#89764b] mr-1" />
                            {product.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
