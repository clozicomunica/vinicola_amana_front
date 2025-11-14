// src/components/ProductCard.tsx

import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/useCart";
import toast from "react-hot-toast";
import type { Wine, CartItem } from "../types";
import wineImage from "../assets/wine-bottle.jpg";

interface ProductCardProps {
  wine: Wine;
  index: number;
}

const decodeHtmlEntities = (html: string): string => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export const ProductCard: React.FC<ProductCardProps> = ({ wine, index }) => {
  const { addToCart } = useCart();

  const price = parseFloat(wine.variants[0]?.price ?? "0");
  const compareAtPrice = wine.variants[0]?.compare_at_price
    ? parseFloat(wine.variants[0].compare_at_price)
    : null;
  const isOnSale = compareAtPrice && compareAtPrice > price;
  const displayCategory = wine.variants[0].values
    .map((val) => val.pt)
    .join(" - ");
  const stock = wine.variants.map((variant) => variant.stock);
  const isOutOfStock = stock[0] === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("Produto indisponível!", {
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
      return;
    }

    const firstVariant = wine.variants[0];
    if (!firstVariant) return;

    const item: CartItem = {
      id: wine.id,
      variant_id: firstVariant.id,
      name: wine.name.pt,
      price: parseFloat(firstVariant.price),
      quantity: 1,
      image: wine.images[0]?.src || wineImage,
      category: displayCategory,
      stock: stock[0],
    };

    addToCart(item);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (index % 12) * 0.05 }}
      className="group bg-white rounded-xl overflow-hidden border border-[#9c9c9c]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full font-['Oswald']"
    >
      <div className="relative flex items-center justify-center h-60 md:h-80 bg-gradient-to-b from-[#f5f5f5] to-[#e5e5e5] p-4 md:p-6">
        <Link
          to={`/produto/${wine.id}`}
          className="h-full w-full flex items-center justify-center"
        >
          <motion.img
            src={wine.images[0]?.src || wineImage}
            alt={wine.images[0]?.alt?.[0] || wine.name.pt}
            className="max-h-[150px] sm:max-h-[200px] md:max-h-full w-auto object-contain transition duration-500 group-hover:scale-105"
            style={{
              mixBlendMode: "multiply",
              filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))",
            }}
            whileHover={{ scale: 1.05 }}
          />
        </Link>

        {/* Badges superiores */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOnSale && (
            <motion.span
              className="bg-[#9a3324] text-white text-xs px-3 py-1 rounded-full shadow-md uppercase tracking-tight font-['Oswald']"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Oferta
            </motion.span>
          )}
        </div>

        {/* Badge de indisponível - apenas a tag */}
        {isOutOfStock && (
          <motion.span
            className="absolute top-3 right-3 bg-[#9c9c9c] text-white text-xs px-3 py-1 rounded-full shadow-md uppercase tracking-tight font-['Oswald']"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Indisponível
          </motion.span>
        )}

        {/* Botões de ação */}
        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 flex items-center gap-2 md:gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/produto/${wine.id}`}
            className="p-2 md:p-3 bg-white/90 rounded-full hover:bg-white transition transform hover:scale-110 shadow-md"
            aria-label="Visualização rápida"
          >
            <Eye className="h-4 w-4 md:h-5 md:w-5 text-[#000000]" />
          </Link>
          <motion.button
            onClick={handleAddToCart}
            className={`p-2 md:p-3 rounded-full transition transform hover:scale-110 shadow-md ${
              isOutOfStock
                ? "bg-[#9c9c9c] cursor-not-allowed"
                : "bg-[#89764b] hover:bg-[#756343] text-white"
            }`}
            aria-label="Adicionar ao carrinho"
            whileHover={{ scale: isOutOfStock ? 1 : 1.1 }}
            whileTap={{ scale: isOutOfStock ? 1 : 0.9 }}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
          </motion.button>
        </div>
      </div>

      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <div className="mb-3 md:mb-4">
          <h3 className="text-[#000000] text-base md:text-lg uppercase tracking-tight mb-1 md:mb-2 line-clamp-1 font-['Oswald']">
            {wine.name.pt}
          </h3>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xs md:text-sm text-[#000000] font-['Oswald']">
              {displayCategory}
            </span>
          </div>
        </div>

        <p className="text-xs md:text-sm text-[#000000] line-clamp-2 md:line-clamp-3 mb-4 md:mb-6 flex-grow font-['Oswald']">
          {decodeHtmlEntities(wine.description.pt.replace(/<[^>]*>/g, ""))}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <span className="text-lg md:text-xl text-[#000000] font-['Oswald']">
              R${price.toFixed(2).replace(".", ",")}
            </span>
            {isOnSale && compareAtPrice && (
              <span className="text-xs md:text-sm text-[#000000] line-through font-['Oswald']">
                R${compareAtPrice.toFixed(2).replace(".", ",")}
              </span>
            )}
          </div>

          <motion.button
            onClick={handleAddToCart}
            className={`w-full px-3 py-2 md:px-4 md:py-3 rounded-lg transition-all duration-300 uppercase tracking-wide text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2 font-['Oswald'] ${
              isOutOfStock
                ? "bg-[#9c9c9c] cursor-not-allowed text-white"
                : "bg-[#89764b] hover:bg-[#756343] text-white hover:shadow-lg"
            }`}
            aria-label="Adicionar ao carrinho"
            whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
            whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
            {isOutOfStock ? "Indisponível" : "Adicionar ao Carrinho"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
