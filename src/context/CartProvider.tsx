import { createContext, useReducer, useEffect, type ReactNode } from "react";

export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
  variant_id: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: number }
  | { type: "CLEAR" };

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((i) => i.id === action.item.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.item.id
            ? { ...i, quantity: i.quantity + action.item.quantity }
            : i
        );
      }
      return [...state, action.item];
    }
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    const stored = localStorage.getItem("cart");
    const initialCart = stored ? JSON.parse(stored) : [];
    return initialCart.map((item: any) => ({
      ...item,
      variant_id: item.variant_id || 0, 
      quantity: item.quantity || 1,
    }));
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    if (!item.variant_id) {
      console.error("variant_id is missing for item:", item);
      return; 
    }
    dispatch({ type: "ADD", item });
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: "REMOVE", id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR" });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, CartContext };
