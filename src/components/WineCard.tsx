// src/components/WineCard.tsx
import { ShoppingCart, Eye} from "lucide-react";
import { Link } from "react-router-dom";
import wineImage from "../assets/wine-bottle.jpg";
import { decodeHtmlEntities } from "../utils/htmlUtils";

export type Wine = {
  id: number;
  name: { pt: string; en?: string };
  description?: { pt?: string; en?: string };
  images: { src: string; alt?: string }[];
  categories: { id: number; name: { pt: string; en?: string } }[];
  variants: { id: number; price: string; stock?: number }[];
  rating?: number;
  year?: number;
  sku?: string;
  alcohol?: string;
  region?: string;
  awards?: string[];
};

type WineCardProps = {
  wine: Wine;
  setQuickViewProduct: (product: Wine | null) => void;
  onAddToCart: (wine: Wine) => void;
};

const WineCard = ({ wine, setQuickViewProduct, onAddToCart }: WineCardProps) => {
  const handleQuickView = () => {
    setQuickViewProduct(wine);
  };

  const handleAddToCartClick = () => {
    onAddToCart(wine);
  };

  return (
    <div
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md md:hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1 md:hover:-translate-y-2 font-oswald"
    >
      <div className="relative aspect-square bg-white p-3 sm:p-4 flex items-center justify-center overflow-hidden">
        <Link
          to={`/produto/${wine.id}`}
          className="h-full w-full flex items-center justify-center p-2 sm:p-3 md:p-4"
        >
          <img
            src={wine.images[0]?.src || wineImage}
            alt={wine.images[0]?.alt || wine.name.pt}
            className="max-h-[240px] sm:max-h-[200px] md:max-h-[220px] w-full object-contain mix-blend-multiply"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = wineImage;
              e.currentTarget.className =
                "max-h-[240px] sm:max-h-[200px] md:max-h-[220px] w-full object-contain";
            }}
          />
        </Link>
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 flex flex-col space-y-1 sm:space-y-2 z-10">
          {wine.variants[0]?.stock === 0 && (
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md font-medium tracking-wide font-oswald">
              Esgotado
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleQuickView();
    }}
    className="p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-md cursor-pointer"
    aria-label="Visualização rápida"
  >
    <Eye className="h-4 w-4 text-gray-800" />
  </button>
  {wine.variants[0]?.stock !== 0 && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleAddToCartClick();
      }}
      className="p-2 bg-[#89764b] text-white rounded-full hover:bg-[#756343] transition-all duration-300 transform hover:scale-105 shadow-md cursor-pointer"
      aria-label="Adicionar ao carrinho"
    >
      <ShoppingCart className="h-4 w-4" />
    </button>
  )}
</div>

      </div>
      <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow">
        <div className="mb-2 sm:mb-3 md:mb-4">
          <Link to={`/produto/${wine.id}`}>
            <h3 className="text-base sm:text-lg md:text-xl text-gray-900 mb-1 sm:mb-2 hover:text-[#89764b] transition-colors duration-300 line-clamp-1 uppercase tracking-tight font-oswald">
              {wine.name.pt}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider font-light font-oswald">
            {wine.categories[0]?.name.pt || "Vinho"}
          </p>
        </div>
        <p className="text-gray-700 mb-3 sm:mb-4 md:mb-6 line-clamp-2 min-h-[36px] sm:min-h-[40px] text-xs sm:text-sm leading-relaxed font-light font-oswald">
          {wine.description?.pt
            ? decodeHtmlEntities(wine.description.pt.replace(/<[^>]*>/g, ""))
            : "Descrição não disponível"}
        </p>
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-black text-base sm:text-lg md:text-xl font-oswald">
                {wine.variants[0]?.price
                  ? `R$ ${parseFloat(wine.variants[0].price)
                      .toFixed(2)
                      .replace(".", ",")}`
                  : "---"}
              </span>
            </div>
          </div>
          <button
            onClick={handleAddToCartClick}
            disabled={wine.variants[0]?.stock === 0}
            className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 uppercase text-xs sm:text-sm ${
              wine.variants[0]?.stock === 0
                ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                : "bg-[#89764b] hover:bg-[#756343] text-white hover:shadow-md"
            } font-oswald`}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            {wine.variants[0]?.stock === 0 ? "Esgotado" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WineCard;