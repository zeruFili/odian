import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../data/products";
import { useCurrency } from "../store/currency";
import { useWishlist } from "../store/wishlist";
import { useToast } from "../store/toast";
import { useCart } from "../store/cart";
import ProductImage from "./ProductImage";
import Badge from "./Badge";
import Icon, { HeartIcon, EyeIcon, StarIcon, CheckIcon, BagIcon } from "./Icons";

interface ProductCardProps {
  product: Product;
  onAdd: (id: string) => void;
  onQuickView?: (product: Product) => void;
  listView?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAdd,
  onQuickView,
  listView = false,
}) => {
  const navigate = useNavigate();
  const { format } = useCurrency();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { openCart } = useCart();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);

  const isWish = isWishlisted(product.id);
  const isOutOfStock = product.type === "outofstock";
  const isLowStock = product.reviews < 10 && !isOutOfStock; // subtle indicator

  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const discountPercent = hasDiscount
    ? Math.round((((product.compareAtPrice ?? product.price) - product.price) / (product.compareAtPrice ?? product.price)) * 100)
    : 0;

  const savingsAmount = hasDiscount && product.compareAtPrice ? product.compareAtPrice - product.price : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't navigate if user clicked an interactive button or element marked with data-no-navigate
    if (target.closest("button") || target.closest("[data-no-navigate]")) {
      return;
    }
    // If user clicked directly on or inside a link, let React Router Link handle it
    if (target.closest("a")) {
      return;
    }
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    onAdd(product.id);
    setAdded(true);
    showToast({
      title: "Added to Shopping Bag",
      message: product.name,
      image: product.image,
      actionLabel: "View Bag",
      onAction: openCart,
    });
    setTimeout(() => setAdded(false), 1600);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast({
      title: isWish ? "Removed from Wishlist" : "Saved to Wishlist",
      message: product.name,
      image: product.image,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const productCode = `ODI-${product.id.slice(0, 5).toUpperCase()}`;

  if (listView) {
    return (
      <li className="list-none">
        <article
          onClick={handleCardClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !(e.target as HTMLElement).closest("button")) {
              navigate(`/product/${product.id}`);
            }
          }}
          tabIndex={0}
          role="article"
          aria-label={product.name}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row p-4 gap-4 sm:gap-6 group cursor-pointer"
        >
          <Link
            to={`/product/${product.id}`}
            className="relative w-full sm:w-48 aspect-square rounded-xl bg-gray-50 overflow-hidden shrink-0 block"
          >
            <ProductImage
              product={product}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
            />
            {hasDiscount && (
              <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                {discountPercent}% OFF
              </span>
            )}
          </Link>

          <div className="flex-1 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold mb-1">
                <span className="uppercase tracking-wider">{product.brand || "Odilia Botanicals"} • {product.category}</span>
                <span className="font-mono text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                  {productCode}
                </span>
              </div>

              <Link
                to={`/product/${product.id}`}
                className="text-base font-bold text-gray-900 group-hover:text-emerald-900 transition-colors font-display block leading-snug"
              >
                {product.name}
              </Link>

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
                <span className="text-[11px] text-gray-500 font-medium">
                  {product.rating.toFixed(1)} ({product.reviews} reviews)
                </span>
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                {hasDiscount && (
                  <span className="text-xs font-semibold text-gray-400 line-through">
                    {format(product.compareAtPrice ?? product.price)}
                  </span>
                )}
                <strong
                  className={`text-xl font-black font-display ${
                    hasDiscount ? "text-rose-600" : "text-[#123d32]"
                  }`}
                >
                  {format(product.price)}
                </strong>
                {hasDiscount && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Save {format(savingsAmount)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-no-navigate="true"
                  onClick={handleWishlist}
                  className={`p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors ${
                    isWish ? "text-rose-600 bg-rose-50 border-rose-200" : "text-gray-600"
                  }`}
                  title="Save to Wishlist"
                  aria-label="Wishlist"
                >
                  <HeartIcon size={16} filled={isWish} />
                </button>
                <button
                  type="button"
                  data-no-navigate="true"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`px-4 py-2.5 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 disabled:opacity-40 active:scale-98 ${
                    hasDiscount
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-[#123d32] hover:bg-[#1a4a3e]"
                  }`}
                >
                  <BagIcon size={14} className={hasDiscount ? "text-white" : "text-amber-400"} />
                  <span>
                    {added
                      ? "Added!"
                      : isOutOfStock
                      ? "Sold Out"
                      : hasDiscount
                      ? "Claim Special Offer"
                      : "Add to Bag"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </article>
      </li>
    );
  }

  return (
    <li className="list-none">
      <article
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !(e.target as HTMLElement).closest("button")) {
            navigate(`/product/${product.id}`);
          }
        }}
        tabIndex={0}
        role="article"
        aria-label={product.name}
        className="h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-emerald-950/20 transition-all duration-300 flex flex-col group cursor-pointer"
      >
        {/* Media Thumbnail with Badges */}
        <div className="relative aspect-4/3 bg-gray-50 overflow-hidden block">
          <Link
            to={`/product/${product.id}`}
            className="w-full h-full block"
            aria-label={product.name}
          >
            <ProductImage
              product={product}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Top-Left Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-xs text-gray-800 px-2.5 py-0.5 rounded-full border border-gray-200 shadow-2xs self-start">
              {product.category}
            </span>

            {hasDiscount && (
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-rose-600 text-white px-2.5 py-1 rounded-full shadow-md self-start border border-rose-500/80 animate-pulse">
                <Icon name="tag" size={11} className="text-amber-300" />
                <span>{discountPercent}% OFF</span>
              </span>
            )}

            {product.badge === "new" && !hasDiscount && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-amber-300 px-2.5 py-0.5 rounded-full shadow-xs self-start border border-emerald-800">
                New Arrival
              </span>
            )}
            {product.badge === "bestseller" && !hasDiscount && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2.5 py-0.5 rounded-full shadow-xs self-start">
                Bestseller
              </span>
            )}
          </div>

          {/* Top-Right Badges: Stock Status & Wishlist Button */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <Badge tone={isOutOfStock ? "red" : isLowStock ? "amber" : "green"} size="sm">
              {isOutOfStock ? "Sold Out" : isLowStock ? "Low Stock" : "In Stock"}
            </Badge>

            <button
              type="button"
              data-no-navigate="true"
              onClick={handleWishlist}
              className={`w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-gray-200 flex items-center justify-center shadow-xs transition-colors hover:scale-105 cursor-pointer ${
                isWish ? "text-rose-600 bg-rose-50 border-rose-200" : "text-gray-500 hover:text-rose-600"
              }`}
              title={isWish ? "Remove from wishlist" : "Add to wishlist"}
              aria-label="Wishlist"
            >
              <HeartIcon size={13} filled={isWish} />
            </button>
          </div>

          {/* Bottom Hover Overlay Chip & Quick View */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <span className="text-[9px] font-semibold bg-[#123d32]/90 text-white px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1 shadow-xs truncate max-w-[70%]">
              <Icon name="leaf" size={10} className="text-amber-300" />
              <span>{product.skinTypes?.slice(0, 2).join(", ") || "All Skin Types"}</span>
            </span>

            {onQuickView && (
              <button
                type="button"
                data-no-navigate="true"
                onClick={handleQuickView}
                className="text-[9px] font-bold bg-white text-gray-800 px-2 py-0.5 rounded-md shadow-xs hover:bg-emerald-950 hover:text-white transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                title="Quick View"
              >
                <EyeIcon size={11} />
                <span>Quick View</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            {/* Brand / SKU line */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold">
              <span className="truncate uppercase tracking-wider">{product.brand || "Odilia Botanicals"}</span>
              <span className="font-mono text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                {productCode}
              </span>
            </div>

            {/* Product Title */}
            <Link
              to={`/product/${product.id}`}
              className="text-sm font-bold text-gray-900 group-hover:text-emerald-900 transition-colors line-clamp-2 font-display block leading-snug"
            >
              {product.name}
            </Link>

            {/* Star Rating */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon
                    key={i}
                    size={11}
                    className={i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-500 font-medium">
                {product.rating.toFixed(1)} ({product.reviews})
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing & Cart Action Section */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            {hasDiscount ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <span>Special Deal</span>
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md font-black">
                    {discountPercent}% OFF
                  </span>
                </div>

                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-semibold text-gray-400 line-through">
                    {format(product.compareAtPrice ?? product.price)}
                  </span>
                  <strong className="text-xl sm:text-2xl font-black text-rose-600 font-display">
                    {format(product.price)}
                  </strong>
                </div>

                {/* Savings Line */}
                <div className="flex items-center justify-between pt-1 border-t border-dashed border-gray-100 text-[11px]">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckIcon size={12} className="text-emerald-600" />
                    Save {format(savingsAmount)}
                  </span>
                  <span className="text-gray-400 text-[10px]">Pure Active Formula</span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">
                    Retail Price
                  </span>
                  <strong className="text-xl font-black text-[#123d32] font-display">
                    {format(product.price)}
                  </strong>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">
                    Efficacy
                  </span>
                  <strong className="text-xs font-bold text-emerald-800 font-display block mt-0.5">
                    Clinical Grade
                  </strong>
                  <span className="text-[9px] text-gray-400">Pure Botanicals</span>
                </div>
              </div>
            )}

            {/* Direct Add to Bag CTA Button (Doqa Style) */}
            <div className="pt-0.5">
              <button
                type="button"
                data-no-navigate="true"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`w-full py-2.5 px-3 text-white rounded-xl text-xs font-bold active:scale-98 transition-all shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 ${
                  hasDiscount
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-900/10"
                    : "bg-[#123d32] hover:bg-[#1a4a3e]"
                }`}
                title={hasDiscount ? "Claim Special Offer" : "Add to Bag"}
              >
                {added ? (
                  <>
                    <CheckIcon size={14} className="text-white" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <BagIcon size={14} className={hasDiscount ? "text-white" : "text-amber-400"} />
                    <span>
                      {isOutOfStock
                        ? "Sold Out"
                        : hasDiscount
                        ? "Claim Special Offer"
                        : "Add to Bag"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
};

export default ProductCard;
