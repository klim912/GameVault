import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "../components/CartContext";
import { WishlistProvider } from "../components/WishlistContext";
import { LibraryProvider } from "../components/LibraryContext";
import { AuthProvider } from "./AuthContext";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const AppProviders = ({ children } : {children: ReactNode}) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <LibraryProvider>{children}</LibraryProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default AppProviders;
