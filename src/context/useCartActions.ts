// src/context/useCartActions.ts
import { useContext } from "react";
import { CartContext } from "./useCart";
import { toast } from "react-hot-toast";
import wineImage from "../assets/wine-bottle.jpg";

export type Wine = {
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

export const useCartActions = () => {
  const cartContext = useContext(CartContext);

  const handleAddToCart = (wine: Wine) => {
    if (!wine.variants[0]?.price) {
      toast.error("Produto indisponível para compra");
      return;
    }

    if (!cartContext?.addToCart) {
      toast.error("Erro interno: função de adicionar ao carrinho não disponível.");
      return;
    }

    const cartItem = {
      id: wine.id,
      name: wine.name.pt,
      price: parseFloat(wine.variants[0].price),
      image: wine.images[0]?.src || wineImage,
      category: wine.categories[0]?.name.pt || "Vinho",
      quantity: 1,
      variant_id: wine.variants[0]?.id,
    };

    cartContext.addToCart(cartItem);

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

  return { addToCart: handleAddToCart };
};
