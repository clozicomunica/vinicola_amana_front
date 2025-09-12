// src/types/index.ts

export interface WineVariant {
  id: number;
  price: string;
  compare_at_price?: string;
  values: { pt: string }[];
}

export interface Wine {
  id: number;
  name: { pt: string };
  variants: WineVariant[];
  images: { src: string; alt?: string[] }[];
  categories: { id: number; name: { pt: string } }[];
  description: { pt: string };
  created_at: string;
}

export interface CartItem {
    id: number;
    variant_id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
}

export interface Category {
    id: string;
    name: string;
}