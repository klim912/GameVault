import { createContext, useContext, useEffect, useState } from "react";

interface Game {
  title: string;
  thumb: string;
  salePrice: string;
  gameID: string;
}

interface WishlistContextType {
  wishlist: Game[];
  addToWishlist: (game: Game) => void;
  removeFromWishlist: (title: string) => void;
  isGameWishlisted: (title: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Game[]>(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (game: Game) => {
    setWishlist((prevItems) => {
      if (!prevItems.find((item) => item.title === game.title)) {
        return [...prevItems, game];
      }
      return prevItems;
    });
  };

  const removeFromWishlist = (title: string) => {
    setWishlist((prevItems) =>
      prevItems.filter((item) => item.title !== title)
    );
  };

  const isGameWishlisted = (title: string) => {
    return wishlist.some((item) => item.title === title);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isGameWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist використано за межами WishlistProvider");
  }
  return context;
}
