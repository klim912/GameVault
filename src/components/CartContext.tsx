import { createContext, useContext, useEffect, useState } from "react";

interface CartItem {
  title: string;
  thumb: string;
  salePrice: string;
  gameID: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (title: string) => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  balance: number;
  setBalance: (amount: number) => void;
  validateCart: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [balance, setBalance] = useState<number>(() => {
    const savedBalance = localStorage.getItem("balance");
    return savedBalance ? parseFloat(savedBalance) : 100;
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("balance", balance.toString());
  }, [balance]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      if (!prevItems.find((i) => i.title === item.title)) {
        return [...prevItems, { ...item, quantity: 1 }];
      }
      return prevItems;
    });
  };

  const removeFromCart = (title: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.title !== title)
    );
  };

  const validateCart = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/validate-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItems),
      });
      const result = await response.json();
      return result.valid;
    } catch {
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        setCartItems,
        balance,
        setBalance,
        validateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart використано за межами CartProvider");
  }
  return context;
}
