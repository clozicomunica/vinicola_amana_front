import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  ChevronRight,
  Wine,
} from "lucide-react";

import { useCart } from "../context/useCart";

interface Wine {
  id: number;
  name: { pt: string };
  variants: { price: string; compare_at_price?: string }[];
  images: { src: string; alt?: string }[];
  categories: { name: { pt: string } }[];
  description: { pt: string };
  created_at: string;
  region?: string;
  alcohol?: string;
  rating?: number;
}

interface Props {
  recommendations: Wine[];
}

const ProductDetailsPage = ({ recommendations }: Props) => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [wine, setWine] = useState<Wine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleAddToCart = () => {
    if (!wine) return;
    addToCart({
      id: wine.id,
      name: wine.name.pt,
      price: parseFloat(wine.variants[0].price),
      quantity: 1,
      image: wine.images[0]?.src || "/placeholder-wine.jpg",
      category: wine.categories[0]?.name.pt || "Vinho",
    });
  };

  useEffect(() => {
    const fetchWineDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://vinicola-amana-back.onrender.com/api/products/${id}`
        );
        if (!response.ok) throw new Error("Produto não encontrado");
        const data = await response.json();

        // Adiciona dados fictícios para demonstração
        const enhancedData = {
          ...data,
          rating: data.rating || +(4.0 + Math.random() * 1.0).toFixed(1),
          alcohol: data.alcohol || `${(12 + Math.random() * 4).toFixed(1)}%`,
          region:
            data.region ||
            ["Vale dos Vinhedos", "Serra Gaúcha", "Vale do São Francisco"][
              Math.floor(Math.random() * 3)
            ],
        };

        setWine(enhancedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    fetchWineDetails();
  }, [id]);

  const formatPrice = (price: string) => {
    return parseFloat(price).toFixed(2).replace(".", ",");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f8f5f0]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-[#89764b]/20 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8f5f0] p-6 text-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-[#9a3324] mb-4">
            Ocorreu um erro
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link
            to="/vinhos"
            className="inline-flex items-center px-6 py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all font-medium"
          >
            <ArrowLeft className="mr-2" />
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  if (!wine) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8f5f0] p-6 text-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md">
          <Wine className="h-12 w-12 mx-auto text-[#89764b] mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Produto não encontrado
          </h2>
          <p className="text-gray-700 mb-6">
            O vinho que você está procurando não está disponível no momento.
          </p>
          <Link
            to="/vinhos"
            className="inline-flex items-center px-6 py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all font-medium"
          >
            <ArrowLeft className="mr-2" />
            Explorar nossa coleção
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f5f0] min-h-screen">
      {/* Voltar */}
      <div className="container mx-auto px-4 lg:px-8 pt-8">
        <Link
          to="/vinhos"
          className="inline-flex items-center text-[#89764b] hover:text-[#756343] group transition-all"
        >
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar para a loja</span>
        </Link>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Imagem Principal */}
            <div className="flex items-center justify-center h-[400px] mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
              <img
                src={
                  wine.images[activeImageIndex]?.src || "/placeholder-wine.jpg"
                }
                alt={wine.images[activeImageIndex]?.alt || wine.name.pt}
                className="max-h-full max-w-full object-contain"
                style={{
                  mixBlendMode: "multiply",
                  filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))",
                }}
              />
            </div>

            {/* Thumbnails */}
            {wine.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {wine.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-white ${
                      activeImageIndex === index
                        ? "border-[#89764b]"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt || `Miniatura ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalhes do Produto */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                {wine.rating && (
                  <div className="flex items-center bg-amber-100 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                    <span className="font-medium text-amber-800 text-sm">
                      {wine.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-600 uppercase tracking-wider">
                  {wine.categories[0]?.name.pt || "Vinho"}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 font-oswald uppercase tracking-tight">
                {wine.name.pt}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                {wine.region && (
                  <span className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-1"
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
                  <span className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {wine.alcohol}
                  </span>
                )}
                {wine.created_at && (
                  <span className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-1"
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
            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-3xl font-bold text-[#89764b]">
                  R$ {formatPrice(wine.variants[0].price)}
                </span>
                {wine.variants[0]?.compare_at_price && (
                  <span className="text-lg text-gray-500 line-through">
                    R$ {formatPrice(wine.variants[0].compare_at_price)}
                  </span>
                )}
              </div>
              {wine.variants[0]?.compare_at_price && (
                <span className="inline-block bg-[#89764b]/10 text-[#89764b] px-2 py-1 rounded text-sm font-medium">
                  Economize R${" "}
                  {(
                    parseFloat(wine.variants[0].compare_at_price) -
                    parseFloat(wine.variants[0].price)
                  )
                    .toFixed(2)
                    .replace(".", ",")}
                </span>
              )}
            </div>

            {/* Descrição */}
            <div className="prose max-w-none text-gray-700 mb-8">
              <div dangerouslySetInnerHTML={{ __html: wine.description.pt }} />
            </div>

            {/* Botão de compra */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-gradient-to-r from-[#89764b] to-[#a08d5f] hover:from-[#756343] hover:to-[#89764b] text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-oswald uppercase tracking-wider text-sm flex items-center justify-center gap-3"
            >
              <ShoppingCart className="h-5 w-5" />
              Adicionar ao Carrinho
            </button>

            {/* Entrega e Garantia */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-[#89764b] mt-0.5"
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
                  <p className="font-medium">Frete Grátis</p>
                  <p className="text-gray-600">Para todo o Brasil</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-[#89764b] mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium">Garantia</p>
                  <p className="text-gray-600">7 dias para devolução</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recomendações */}
        {recommendations && recommendations.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 font-oswald uppercase tracking-tight">
                Você também pode gostar
              </h2>
              <Link
                to="/vinhos"
                className="flex items-center text-[#89764b] hover:text-[#756343] font-medium"
              >
                Ver todos <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <Link to={`/vinho/${rec.id}`} className="block">
                    <div className="relative h-64 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-6">
                      <img
                        src={rec.images[0]?.src || "/placeholder-wine.jpg"}
                        alt={rec.images[0]?.alt || rec.name.pt}
                        className="max-h-full max-w-full object-contain"
                        style={{
                          mixBlendMode: "multiply",
                          filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-1 font-oswald uppercase tracking-tight line-clamp-1">
                        {rec.name.pt}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 font-oswald uppercase tracking-tight">
                        {rec.categories[0]?.name.pt || "Vinho"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#89764b]">
                          R$ {formatPrice(rec.variants[0].price)}
                        </span>
                        {rec.rating && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                            {rec.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
