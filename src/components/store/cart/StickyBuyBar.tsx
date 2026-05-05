import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { formatPrice, bundlePrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const StickyBuyBar = () => {
  const { bundleData, selectedBundleIndex, addToCart, items, openCart, productData } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 400;
      if (shouldShow !== isVisible) {
        setIsVisible(shouldShow);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  if (!bundleData || bundleData.bundles.length === 0) return null;

  const selectedBundle = bundleData.bundles[selectedBundleIndex] ?? bundleData.bundles[0];
  const price = bundlePrice(
    bundleData.basePriceCents,
    selectedBundle.quantity + (selectedBundle.freeQuantity ?? 0),
    selectedBundle.discountPercent
  );
  const originalPrice = bundleData.basePriceCents * (selectedBundle.quantity + (selectedBundle.freeQuantity ?? 0));

  const handleAddToCart = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    addToCart({
      bundleIndex: selectedBundleIndex,
      bundle: selectedBundle,
      quantity: 1,
      unitPrice: price,
      totalPrice: price,
      currency: bundleData.currency,
      productImage: bundleData.productImage ?? productData?.imageUrl,
      productTitle: productData?.title,
    });
  };

  const cartItemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-3 backdrop-blur-lg transition-transform duration-300 @3xl/store:hidden",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="mx-auto flex max-w-[500px] items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[20px] font-bold">
              {formatPrice(price, bundleData.currency)}
            </span>
            {originalPrice > price && (
              <span className="text-[14px] text-black/40 line-through">
                {formatPrice(originalPrice, bundleData.currency)}
              </span>
            )}
          </div>
          <p className="truncate text-[12px] opacity-60">
            {selectedBundle.freeQuantity
              ? `Buy ${selectedBundle.quantity}, get ${selectedBundle.freeQuantity} free`
              : selectedBundle.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {cartItemCount > 0 && (
            <button
              onClick={openCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-black/10"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
                {cartItemCount}
              </span>
            </button>
          )}
          <button
            onClick={handleAddToCart}
            className={cn(
              "flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 font-semibold text-white transition-transform",
              isAnimating && "scale-95"
            )}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="text-[14px]">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
