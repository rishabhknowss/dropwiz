import { useEffect } from "react";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const PaymentBadges = () => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {["visa", "mastercard", "amex", "paypal", "applepay", "gpay"].map((p) => (
      <div
        key={p}
        className="flex h-10 w-14 items-center justify-center rounded-md border border-black/10 bg-white"
      >
        <img
          src={`/payment/${p}.png`}
          alt={p}
          className="h-5 w-auto"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    ))}
  </div>
);

export const CartDrawer = () => {
  const { isCartOpen, closeCart, items, totalAmount, currency, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300",
          isCartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeCart}
      />
      <div
        className={cn(
          "fixed bottom-0 right-0 top-0 z-[101] flex w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="text-[18px] font-semibold">Your Cart</span>
            {items.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[11px] font-medium text-white">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-5 py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black/5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <p className="text-[16px] font-medium">Your cart is empty</p>
              <p className="mt-1 text-[14px] opacity-60">Add items to get started</p>
              <button
                onClick={closeCart}
                className="mt-5 rounded-lg bg-black px-6 py-2.5 text-[14px] font-medium text-white"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {items.map((item) => (
                <div key={item.bundleIndex} className="flex gap-4 px-5 py-4">
                  {item.productImage && (
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-black/5 bg-black/[0.02]">
                      <img
                        src={item.productImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[14px] font-medium leading-tight">
                          {item.bundle.freeQuantity
                            ? `Buy ${item.bundle.quantity}, Get ${item.bundle.freeQuantity} Free`
                            : `${item.bundle.quantity} ${item.bundle.quantity === 1 ? "item" : "items"}`}
                        </p>
                        {item.productTitle && (
                          <p className="mt-0.5 text-[12px] opacity-60">{item.productTitle}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.bundleIndex)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded hover:bg-black/5"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-black/10">
                        <button
                          onClick={() => updateQuantity(item.bundleIndex, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center hover:bg-black/5"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                        <span className="w-8 text-center text-[14px] font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.bundleIndex, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center hover:bg-black/5"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-[15px] font-semibold">
                        {formatPrice(item.totalPrice, item.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-black/10 px-5 pb-6 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[15px] font-medium">Subtotal</span>
              <span className="text-[18px] font-bold">{formatPrice(totalAmount, currency)}</span>
            </div>
            <button
              className="w-full rounded-xl bg-black py-4 text-[15px] font-semibold text-white transition hover:bg-black/90"
            >
              Checkout
            </button>
            <p className="mt-3 text-center text-[12px] opacity-60">
              Shipping & taxes calculated at checkout
            </p>
            <div className="mt-4">
              <PaymentBadges />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
