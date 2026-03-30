import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  productId: number;
  variantId: number;
  productName: string;
  image: string;
  price: number;
  productRef: string;
  color: string;
  size: string;
  startDate: string;
  endDate: string;
  quantity: number;
};


type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: number) => void;      
  updateQuantity: (variantId: number, quantity: number) => void; 
  clearCart: () => void;
};


const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.variantId === item.variantId
      );

      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, item];
    });
  }

  function removeItem(variantId: number) {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  }
  
  function updateQuantity(variantId: number, quantity: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans un CartProvider");
  return context;
}