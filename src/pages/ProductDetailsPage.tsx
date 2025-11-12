import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  ChevronRight,
  Wine,
  Utensils,
  ZoomIn,
  Leaf,
  Thermometer,
  Clock,
  Hourglass,
} from "lucide-react";
import { useCart } from "../context/useCart";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

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
  pairing?: string;
  vintage?: string;
  temperatura?: string;
  varietal?: string;
  amadurecimento?: string;
  expectativa_guarda?: string;
}

const WINES_DATA = {
  wines: {
    "282621881": {
      id: 1,
      name: "Sauvignon Blanc Amana",
      vintage: "2024",
      alcohol: "13,1%",
      region: "Espírito Santo do Pinhal",
      pairing:
        "saladas, sushi, ceviche, massas com molho pesto e queijos leves",
      temperatura: "8 ºC a 10 ºC",
      varietal: "100% Sauvignon Blanc",
      amadurecimento: "6 meses em cubas de inox",
      expectativa_guarda: "Pronto para consumo",
    },
    "282630061": {
      id: 2,
      name: "Chenin Blanc Amana",
      vintage: "2024",
      alcohol: "13,0%",
      region: "Espírito Santo do Pinhal",
      pairing:
        "queijos médios, peixes, frutos do mar e carnes brancas grelhadas com molho bechamel",
      temperatura: "8 ºC a 10 ºC",
      varietal: "100% Chenin Blanc",
      amadurecimento: "50% por 5 meses em barricas francesas",
      expectativa_guarda: "Pronto para consumo",
    },
    "282629404": {
      id: 3,
      name: "Rosé Amana",
      vintage: "2024",
      alcohol: "13,0%",
      region: "Espírito Santo do Pinhal",
      pairing:
        "camarões salteados, lagosta, salmão grelhado ou gravlax e massas com limão siciliano",
      temperatura: "8 ºC a 10 ºC",
      varietal: "70% Syrah e 30% Chenin Blanc",
      amadurecimento: "6 meses em cubas de inox",
      expectativa_guarda: "Pronto para consumo",
    },
    "282630773": {
      id: 4,
      name: "Syrah Amana",
      vintage: "2022",
      alcohol: "14%",
      region: "Espírito Santo do Pinhal",
      pairing:
        "charcutaria, queijos meia-cura, massa seca à bolonhesa ou ragú de calabresa",
      temperatura: "12 ºC a 14 ºC",
      varietal: "100% Syrah",
      amadurecimento: "6 meses em tanques de aço inox",
      expectativa_guarda: "Bom potencial de guarda",
    },
    "281768712": {
      id: 5,
      name: "Syrah T4 Linha Singular",
      vintage: "2022",
      alcohol: "14.9%",
      region: "Espírito Santo do Pinhal",
      pairing:
        "Carnes vermelhas de longa cocção e massas acompanhadas de molhos encorpados e condimentados",
      temperatura: "16 ºC a 18 ºC",
      varietal: "100% Syrah",
      amadurecimento:
        "12 meses em barricas de carvalho francês de primeiro e segundo uso",
      expectativa_guarda: "Ótimo potencial de guarda com excelente longevidade",
    },
    "282621048": {
      id: 6,
      name: "Sauvignon Blanc Amana Una",
      vintage: "2023",
      alcohol: "13,0%",
      region: "Espírito Santo do Pinhal",
      pairing:
        "massas, peixes ou aves com molhos cremosos e untuosos: risotos de frutos do mar ou de limão siciliano; queijos de média maturação",
      temperatura: "8 ºC a 10 ºC",
      varietal: "100% Sauvignon Blanc",
      amadurecimento: "80% passou 10 meses em barricas francesas",
      expectativa_guarda: "Pronto para consumo",
    },
    "282619996": {
      id: 7,
      name: "Syrah Amana Una",
      vintage: "2022",
      alcohol: "14,9%",
      region: "Espírito Santo do Pinhal",
      pairing:
        "Carnes vermelhas de longa cocção e massas acompanhadas de molhos encorpados e condimentados",
      temperatura: "16 ºC a 18 ºC",
      varietal: "100% Syrah",
      amadurecimento:
        "12 meses em barricas de carvalho francês de primeiro e segundo uso",
      expectativa_guarda: "Ótimo potencial de guarda com excelente longevidade",
    },
  },
};

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

  const enhanceWine = (data: Wine, wineId: string): Wine => {
    const additionalData =
      WINES_DATA.wines[wineId as keyof typeof WINES_DATA.wines];
    if (!additionalData) {
      // Removido o fallback aleatório para evitar adicionar dados irrelevantes em produtos não-vinhos
      return data;
    }
    return {
      ...data,
      alcohol: additionalData.alcohol,
      region: additionalData.region,
      pairing: additionalData.pairing,
      vintage: additionalData.vintage,
      temperatura: additionalData.temperatura,
      varietal: additionalData.varietal,
      amadurecimento: additionalData.amadurecimento,
      expectativa_guarda: additionalData.expectativa_guarda,
    };
  };

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

        const response = await fetch(`${API_URL}/api/products/${id}`);

        if (!response.ok) throw new Error("Produto não encontrado");

        const data = await response.json();

        const enhancedWine = enhanceWine(data, id);
        setWine(enhancedWine);

        const categoryName = enhancedWine.categories[0]?.name.pt || "";
        if (categoryName) {
          const similarResponse = await fetch(
            `${API_URL}/api/products/${enhancedWine.id}/similares`
          );
          if (similarResponse.ok) {
            const similarData = await similarResponse.json();
            setSimilarProducts(
              similarData
                .filter((item: Wine) => item.id !== enhancedWine.id)
                .slice(0, 4)
                .map((item: Wine) => enhanceWine(item, item.id.toString()))
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
      <div className="min-h-screen flex justify-center items-center bg-[#d4d4d4] font-['Oswald']">
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
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#d4d4d4] p-4 sm:p-6 text-center font-['Oswald']">
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
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#d4d4d4] p-4 sm:p-6 text-center font-['Oswald']">
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
    <div className="bg-[#d4d4d4] min-h-screen font-['Oswald']">
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
          </div>

          {/* Detalhes do Produto */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 flex flex-col">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
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
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="10" cy="14" r="6" />
                      <circle cx="18" cy="8" r="4" />
                      <circle cx="20" cy="16" r="2" />
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
                {wine.vintage && (
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
                    {wine.vintage}
                  </span>
                )}
                {wine.varietal && (
                  <span className="flex items-center font-['Oswald']">
                    <Leaf className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-[#89764b]" />
                    {wine.varietal}
                  </span>
                )}
                {wine.temperatura && (
                  <span className="flex items-center font-['Oswald']">
                    <Thermometer className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-[#89764b]" />
                    {wine.temperatura}
                  </span>
                )}
                {wine.amadurecimento && (
                  <span className="flex items-center font-['Oswald']">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-[#89764b]" />
                    {wine.amadurecimento}
                  </span>
                )}
                {wine.expectativa_guarda && (
                  <span className="flex items-center font-['Oswald']">
                    <Hourglass className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-[#89764b]" />
                    {wine.expectativa_guarda}
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
                {wine.variants[0]?.compare_at_price &&
                  parseFloat(wine.variants[0].compare_at_price) >
                    parseFloat(wine.variants[0].price) && (
                    <span className="text-base sm:text-lg text-gray-500 line-through font-['Oswald']">
                      R$ {formatPrice(wine.variants[0].compare_at_price)}
                    </span>
                  )}
              </div>
              {wine.variants[0]?.compare_at_price &&
                parseFloat(wine.variants[0].compare_at_price) >
                  parseFloat(wine.variants[0].price) && (
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
              {wine.pairing && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-[#89764b] mt-0.5" />
                  <div>
                    <p className="text-gray-800 font-medium font-['Oswald']">
                      Harmonização
                    </p>
                    <p className="text-gray-500 font-['Oswald']">
                      {wine.pairing}
                    </p>
                  </div>
                </div>
              )}
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
