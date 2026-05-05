import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Bundle, BundleData, ProductData } from "@/types/store-sections";

export type CartItem = {
  bundleIndex: number;
  bundle: Bundle;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  productImage?: string;
  productTitle?: string;
};

type CartContextValue = {
  items: CartItem[];
  selectedBundleIndex: number;
  isCartOpen: boolean;
  totalAmount: number;
  currency: string;
  productData: ProductData | null;
  bundleData: BundleData | null;
  setSelectedBundleIndex: (index: number) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (bundleIndex: number) => void;
  updateQuantity: (bundleIndex: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setProductData: (data: ProductData) => void;
  setBundleData: (data: BundleData) => void;
  getCheckoutUrl: () => string;
};

const CartContext = createContext<CartContextValue | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const useCartOptional = () => {
  return useContext(CartContext);
};

type CartProviderProps = {
  children: ReactNode;
  shopifyDomain?: string;
  shopifyProductId?: string;
};

export const CartProvider = ({ children, shopifyDomain, shopifyProductId }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedBundleIndex, setSelectedBundleIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [bundleData, setBundleData] = useState<BundleData | null>(null);

  const currency = items[0]?.currency ?? bundleData?.currency ?? "USD";

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.bundleIndex === item.bundleIndex);
      if (existing) {
        return prev.map((i) =>
          i.bundleIndex === item.bundleIndex
            ? { ...i, quantity: i.quantity + item.quantity, totalPrice: (i.quantity + item.quantity) * i.unitPrice }
            : i
        );
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((bundleIndex: number) => {
    setItems((prev) => prev.filter((i) => i.bundleIndex !== bundleIndex));
  }, []);

  const updateQuantity = useCallback((bundleIndex: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bundleIndex);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.bundleIndex === bundleIndex
          ? { ...i, quantity, totalPrice: quantity * i.unitPrice }
          : i
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const getCheckoutUrl = useCallback(() => {
    if (!shopifyDomain || !shopifyProductId) {
      return "#";
    }
    const variantId = shopifyProductId;
    const qty = items.reduce((sum, i) => sum + i.quantity * (i.bundle.quantity + (i.bundle.freeQuantity ?? 0)), 0);
    return `https://${shopifyDomain}/cart/${variantId}:${qty}`;
  }, [shopifyDomain, shopifyProductId, items]);

  return (
    <CartContext.Provider
      value={{
        items,
        selectedBundleIndex,
        isCartOpen,
        totalAmount,
        currency,
        productData,
        bundleData,
        setSelectedBundleIndex,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        setProductData,
        setBundleData,
        getCheckoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
