import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../store/cart";
import { useCurrency } from "../store/currency";
import ProductImage from "./ProductImage";
import Icon, { CloseIcon, TruckIcon, ShieldCheckIcon, CheckIcon, BagIcon } from "./Icons";

const FREE_SHIPPING_THRESHOLD_USD = 60;

export default function CartDrawer() {
  const { lines, isOpen, closeCart, subtotal, removeFromCart, setQuantity, count } = useCart();
  const { format } = useCurrency();

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeCart]);

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const code = promoCode.trim().toUpperCase();
    if (code === "WELCOME15" || code === "RADIANCE20") {
      const discount = code === "RADIANCE20" ? 20 : 15;
      setDiscountPercent(discount);
      setPromoApplied(`${code} (${discount}% OFF)`);
      setPromoCode("");
    } else {
      setPromoError("Invalid code. Try WELCOME15");
    }
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_USD;
  const shippingCost = isFreeShipping || subtotal === 0 ? 0 : 5.99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD_USD) * 100));
  const amountLeftForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      {/* Slide-out Drawer Panel (Doqa Style) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-left border-l border-gray-200">
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                ODILIA SHOPPING BAG
              </span>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 font-display mt-0.5">
                Your Botanical Selection ({count})
              </h2>
            </div>

            <button
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Close drawer"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-emerald-50/80 px-5 py-3 border-b border-emerald-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-950">
              <span className="flex items-center gap-1.5">
                <TruckIcon size={15} className="text-emerald-700" />
                {isFreeShipping ? (
                  <strong className="text-emerald-800">Complimentary Express Shipping Unlocked! 🎉</strong>
                ) : (
                  <span>
                    Add <strong>${amountLeftForFreeShipping.toFixed(2)}</strong> more for{" "}
                    <strong>Free Delivery</strong>
                  </span>
                )}
              </span>
              <span className="text-[10px] font-bold text-emerald-800">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-700 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {lines.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                  <BagIcon size={28} />
                </div>
                <strong className="text-base font-bold text-gray-900 font-display block">
                  Your shopping bag is empty
                </strong>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Explore our clinical serums, SPF shields, ceramide creams, and botanical elixirs to build your daily beauty ritual.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 px-5 py-2.5 bg-[#123d32] text-white rounded-xl text-xs font-bold hover:bg-[#1a4a3e]"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {lines.map((line) => {
                  const p = line.product;
                  return (
                    <div
                      key={p.id}
                      className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center gap-3 text-xs"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                        <ProductImage product={p} className="w-full h-full object-cover" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-gray-900 font-bold block truncate font-display">
                            {p.name}
                          </strong>
                          <button
                            onClick={() => removeFromCart(p.id)}
                            className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <CloseIcon size={14} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-gray-500">
                            {format(p.price)}
                          </span>

                          {/* Stepper */}
                          <div className="flex items-center border border-gray-200 rounded-lg bg-white p-0.5">
                            <button
                              onClick={() => setQuantity(p.id, Math.max(1, line.quantity - 1))}
                              className="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-xs font-bold"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-xs font-bold">{line.quantity}</span>
                            <button
                              onClick={() => setQuantity(p.id, line.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {lines.length > 0 && (
            <div className="p-5 border-t border-gray-200 bg-white space-y-4 shadow-lg">
              {/* Promo code box */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon code (e.g. WELCOME15)"
                    className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-emerald-700"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-rose-600 font-semibold">{promoError}</p>}
                {promoApplied && (
                  <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckIcon size={12} /> {promoApplied} applied
                  </p>
                )}
              </form>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <strong className="text-gray-900 font-bold">{format(subtotal)}</strong>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Discount ({discountPercent}%):</span>
                    <span>-{format(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{isFreeShipping ? <strong className="text-emerald-700">Free</strong> : format(shippingCost)}</span>
                </div>

                <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span className="font-display">Total Amount:</span>
                  <span className="font-display text-[#123d32] text-base">{format(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button (Doqa Style) */}
              <button
                onClick={() => {
                  alert("Proceeding to secure atelier checkout...");
                }}
                className="w-full py-3.5 bg-[#123d32] hover:bg-[#1a4a3e] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <BagIcon size={16} className="text-amber-400" />
                <span>Secure Checkout • {format(finalTotal)}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-semibold">
                <ShieldCheckIcon size={13} className="text-emerald-700" />
                <span>256-Bit SSL Encrypted & Certified Authentic</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
