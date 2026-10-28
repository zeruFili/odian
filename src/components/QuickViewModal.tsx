import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import { useCurrency } from "../store/currency";
import { useCart } from "../store/cart";
import { useWishlist } from "../store/wishlist";
import { useToast } from "../store/toast";
import ProductImage from "./ProductImage";
import Badge from "./Badge";
import Icon, { CloseIcon, HeartIcon, StarIcon, CheckIcon, BagIcon } from "./Icons";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: Props) {
  const { format } = useCurrency();
  const { addToCart, openCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setActiveImage(0);
    setAdded(false);
  }, [product?.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (product) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  if (!product) return null;

  const gallery = Array.from(
    new Set([product.image, ...(product.images ?? [])].filter((img): img is string => Boolean(img)))
  );

  const isOutOfStock = product.type === "outofstock";
  const isWish = isWishlisted(product.id);

  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const discountPercent = hasDiscount
    ? Math.round((((product.compareAtPrice ?? product.price) - product.price) / (product.compareAtPrice ?? product.price)) * 100)
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product.id, quantity);
    setAdded(true);
    showToast({
      title: "Added to Bag",
      message: `${quantity} × ${product.name}`,
      image: product.image,
      actionLabel: "View Bag",
      onAction: openCart,
    });
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gray-950/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-7 shadow-2xl border border-gray-200 relative max-h-[92vh] overflow-y-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors z-10"
          aria-label="Close modal"
        >
          <CloseIcon size={18} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          {/* Media Showcase */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
              <ProductImage
                product={product}
                src={gallery[activeImage]}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 text-gray-800 px-2.5 py-0.5 rounded-full border border-gray-200 shadow-2xs">
                  {product.category}
                </span>
                {hasDiscount && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 ${
                      activeImage === i ? "border-[#123d32] shadow-xs" : "border-gray-200 opacity-70"
                    }`}
                  >
                    <ProductImage product={product} src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                {product.brand || "Odilia Botanicals"}
              </span>
              <h3 className="text-xl font-black font-display text-gray-900 mt-0.5 leading-snug">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon
                      key={i}
                      size={12}
                      className={i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-semibold">
                  {product.rating.toFixed(1)} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2.5">
              {hasDiscount && (
                <span className="text-xs font-semibold text-gray-400 line-through">
                  {format(product.compareAtPrice ?? product.price)}
                </span>
              )}
              <strong
                className={`text-2xl font-black font-display ${
                  hasDiscount ? "text-rose-600" : "text-[#123d32]"
                }`}
              >
                {format(product.price)}
              </strong>
            </div>

            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Skin types */}
            <div className="flex flex-wrap gap-1">
              {product.skinTypes.map((st) => (
                <span
                  key={st}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-900 border border-emerald-100"
                >
                  🌿 {st}
                </span>
              ))}
            </div>

            {/* Quantity and Actions */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                {!isOutOfStock && (
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-0.5">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold text-xs flex items-center justify-center text-gray-700"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-display">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold text-xs flex items-center justify-center text-gray-700"
                    >
                      +
                    </button>
                  </div>
                )}

                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="flex-1 py-2.5 px-4 bg-[#123d32] hover:bg-[#1a4a3e] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 disabled:opacity-40"
                >
                  {added ? (
                    <>
                      <CheckIcon size={14} className="text-white" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <BagIcon size={14} className="text-amber-400" />
                      <span>{isOutOfStock ? "Sold Out" : "Add to Bag"}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-xl border border-gray-200 transition-colors ${
                    isWish ? "text-rose-600 bg-rose-50 border-rose-200" : "text-gray-500 hover:text-rose-600"
                  }`}
                  title="Save to Wishlist"
                >
                  <HeartIcon size={16} filled={isWish} />
                </button>
              </div>

              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="block text-center text-xs font-bold text-emerald-800 hover:text-emerald-950 pt-1 hover:underline"
              >
                View Full Clinical Product Page →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
