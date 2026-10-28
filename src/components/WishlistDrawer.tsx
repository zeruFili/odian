import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../store/wishlist";
import { useCart } from "../store/cart";
import { useCurrency } from "../store/currency";
import { useToast } from "../store/toast";
import ProductImage from "./ProductImage";
import Icon, { CloseIcon, HeartIcon, BagIcon } from "./Icons";

export default function WishlistDrawer() {
  const { wishlistProducts, isOpen, closeWishlist, removeFromWishlist, count } = useWishlist();
  const { addToCart, openCart } = useCart();
  const { format } = useCurrency();
  const { showToast } = useToast();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeWishlist();
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeWishlist]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeWishlist}
      />

      {/* Slide-out Drawer Panel (Doqa Style) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <aside className="w-full sm:w-screen sm:max-w-md bg-white shadow-2xl flex flex-col animate-slide-left border-l border-gray-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">
                SAVED FORMULATIONS
              </span>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 font-display mt-0.5 flex items-center gap-2">
                <HeartIcon size={18} filled={true} className="text-rose-600" />
                <span>My Wishlist ({count})</span>
              </h2>
            </div>

            <button
              onClick={closeWishlist}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Close wishlist"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                  <HeartIcon size={30} strokeWidth={1.5} />
                </div>
                <strong className="text-base font-bold text-gray-900 font-display block">
                  Your wishlist is empty
                </strong>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Click the heart icon on any botanical serum, moisturizer, or cleanser to save your favorites for later.
                </p>
                <button
                  onClick={closeWishlist}
                  className="mt-2 px-5 py-2.5 bg-emerald-950 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlistProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center gap-3 text-xs"
                  >
                    <Link
                      to={`/product/${product.id}`}
                      onClick={closeWishlist}
                      className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 shrink-0 block"
                    >
                      <ProductImage product={product} className="w-full h-full object-cover" />
                    </Link>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/product/${product.id}`}
                          onClick={closeWishlist}
                          className="text-gray-900 font-bold block truncate font-display hover:text-emerald-900 transition-colors"
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <CloseIcon size={14} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#123d32] font-display">
                          {format(product.price)}
                        </span>

                        <button
                          onClick={() => {
                            addToCart(product.id, 1);
                            showToast({
                              title: "Added to Bag",
                              message: product.name,
                              image: product.image,
                              actionLabel: "View Bag",
                              onAction: openCart,
                            });
                          }}
                          className="px-2.5 py-1 bg-[#123d32] hover:bg-[#1a4a3e] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <BagIcon size={12} className="text-amber-400" />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
