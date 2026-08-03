import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string; // unique key slug-flavor-format
  slug: string;
  name: string;
  image: string;
  flavor?: string;
  format?: string;
  priceTtc: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: {
    slug: string;
    name: string;
    image: string;
    flavor?: string;
    format?: string;
    priceTtc: number;
    quantity?: number;
  }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalTtc: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CART_STORAGE_KEY = "nutriwell_cart_v1";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Erreur lors de la sauvegarde du panier", e);
    }
  }, [cart]);

  const addToCart = (newItem: {
    slug: string;
    name: string;
    image: string;
    flavor?: string;
    format?: string;
    priceTtc: number;
    quantity?: number;
  }) => {
    const flavorStr = newItem.flavor || "Standard";
    const formatStr = newItem.format || "Standard";
    const id = `${newItem.slug}-${flavorStr}-${formatStr}`;
    const qty = newItem.quantity || 1;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [
        ...prevCart,
        {
          id,
          slug: newItem.slug,
          name: newItem.name,
          image: newItem.image,
          flavor: newItem.flavor,
          format: newItem.format,
          priceTtc: newItem.priceTtc || 0,
          quantity: qty,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const totalTtc = cart.reduce((total, item) => total + item.priceTtc * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalTtc,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  }
  return context;
};
