import { createContext, useContext, useEffect, useState } from "react";

interface LibraryItem {
  title: string;
  gameID: string;
  purchaseDate: string;
  orderId: string;
}

interface Receipt {
  orderId: string;
  games: { title: string; price: string; quantity: number }[];
  date: string;
  amount: string;
  paymentMethod: string;
}

interface LibraryContextType {
  library: LibraryItem[];
  addToLibrary: (
    items: { title: string; gameID: string }[],
    orderId: string
  ) => void;
  receipts: Receipt[];
  addReceipt: (receipt: Receipt) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [library, setLibrary] = useState<LibraryItem[]>(() => {
    const saved = localStorage.getItem("library");
    return saved ? JSON.parse(saved) : [];
  });

  const [receipts, setReceipts] = useState<Receipt[]>(() => {
    const saved = localStorage.getItem("receipts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("library", JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem("receipts", JSON.stringify(receipts));
  }, [receipts]);

  const addToLibrary = (
    items: { title: string; gameID: string }[],
    orderId: string
  ) => {
    const purchaseDate = new Date().toISOString();
    setLibrary((prev) => [
      ...prev,
      ...items.map((item) => ({ ...item, purchaseDate, orderId })),
    ]);
  };

  const addReceipt = (receipt: Receipt) => {
    setReceipts((prev) => [...prev, receipt]);
  };

  return (
    <LibraryContext.Provider
      value={{ library, addToLibrary, receipts, addReceipt }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary використано за межами LibraryProvider");
  }
  return context;
}
