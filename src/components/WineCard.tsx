// src/components/WineCard.tsx
import { ShoppingCart, Eye, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import { toast } from "react-hot-toast";

type WineCategory = "Tinto" | "Branco" | "Rosé" | "Espumante" | "Sobremesa";

type Wine = {
  id: number;
  variant_id: number;
  name: string;
  price: number;
  image: string;
  category: WineCategory;
  description: string;
  rating?: number;
  year?: number;
  discount?: number;
};

const WineCard = ({ wine }: { wine: Wine }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: wine.id,
      variant_id: wine.variant_id,
      name: wine.name,
      image: wine.image,
      price: wine.price,
      quantity: 1,
      category: wine.category,
    });

    toast.success(`${wine.name} adicionado ao carrinho!`, {
      position: "bottom-right",
      style: {
        background: "#89764b",
        color: "#fff",
      },
    });
  };

  const handleQuickView = () => {
    toast(`Visualizando ${wine.name}`, {
      icon: "🔍",
      position: "top-center",
    });
  };

  return (
    <div className="group overflow-hidden border border-gray-200 rounded-lg hover:shadow-xl transition-all duration-300 bg-white flex flex-col h-full font-oswald">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2">
        {wine.discount && (
          <span className="bg-[#89764b] text-white text-xs px-2 py-1 rounded-full shadow-md">
            -{wine.discount}%
          </span>
        )}
        {wine.rating && wine.rating >= 4.5 && (
          <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full shadow-md flex items-center">
            <Star className="h-3 w-3 mr-1 fill-current" />
            {wine.rating.toFixed(1)}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
        aria-label="Adicionar à lista de desejos"
      >
        <Heart className="h-4 w-4 text-[#9c9c9c] hover:text-red-500 transition-colors" />
      </button>

      {/* Wine Image */}
      <div className="relative overflow-hidden h-64 flex-shrink-0">
        <Link to={`/vinhos/${wine.id}`}>
          <img
            src={wine.image}
            alt={wine.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            loading="lazy"
          />
        </Link>

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleQuickView}
            className="p-3 bg-white/90 rounded-full hover:bg-white transition-all duration-200 transform hover:scale-110 shadow-md"
            aria-label="Visualização rápida"
          >
            <Eye className="h-5 w-5 text-[#9c9c9c]" />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-3 bg-[#89764b] text-white rounded-full hover:bg-[#9a3324] transition-all duration-200 transform hover:scale-110 shadow-md"
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Wine Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <Link to={`/vinhos/${wine.id}`}>
            <h3 className="text-lg mb-1 hover:text-[#89764b] transition-colors line-clamp-1">
              {wine.name}
            </h3>
          </Link>
          <div className="flex items-center justify-between">
            <span style={{ color: "#9c9c9c" }} className="text-sm capitalize">
              {wine.category}
            </span>
            {wine.year && (
              <span
                style={{ backgroundColor: "#f9f9f9", color: "#9c9c9c" }}
                className="text-xs px-2 py-1 rounded"
              >
                Safra {wine.year}
              </span>
            )}
          </div>
        </div>

        <p
          className="text-sm my-2 line-clamp-2 flex-grow"
          style={{ color: "#9c9c9c" }}
        >
          {wine.description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-lg ${wine.discount ? "line-through" : ""}`}
              style={{
                color: wine.discount ? "#9c9c9c" : "#89764b",
                fontWeight: "normal",
              }}
            >
              R$ {wine.price.toFixed(2).replace(".", ",")}
            </span>
            {wine.discount && (
              <span
                className="text-lg"
                style={{ color: "#89764b", fontWeight: "normal" }}
              >
                R${" "}
                {(wine.price * (1 - wine.discount / 100))
                  .toFixed(2)
                  .replace(".", ",")}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-[#89764b] hover:bg-[#9a3324] text-white rounded text-sm transition-colors duration-300 flex items-center gap-1"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WineCard;
