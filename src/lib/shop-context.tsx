import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useRouter } from "next/router";

type ShopContextType = {
  selectedShop: string | null;
  setSelectedShop: (shop: string | null) => void;
};

const ShopContext = createContext<ShopContextType | null>(null);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const selectedShop = (router.query.shop as string) || null;

  const setSelectedShop = useCallback(
    (shop: string | null) => {
      const query = { ...router.query };
      if (shop) {
        query.shop = shop;
      } else {
        delete query.shop;
      }
      router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
    },
    [router]
  );

  return (
    <ShopContext.Provider value={{ selectedShop, setSelectedShop }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
