import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { products, type Product } from "../data/products";
import { useCart } from "../store/cart";
import { useCurrency } from "../store/currency";
import { useWishlist } from "../store/wishlist";
import { useToast } from "../store/toast";
import ProductImage from "./ProductImage";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import Footer from "./Footer";
import Badge from "./Badge";
import Icon, {
  StarIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  RefreshCwIcon,
  LeafIcon,
  CheckIcon,
  BagIcon,
  CloseIcon,
} from "./Icons";

interface ReviewItem {
  name: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    name: "Sophia Laurent",
    date: "February 12, 2026",
    rating: 5,
    title: "Transformative results in two weeks",
    comment:
      "My skin reacts to almost everything, but this formulation is soothing beyond belief. No redness, no burning, just hydrated, bouncy, healthy skin with an undeniable glow.",
    verified: true,
  },
  {
    name: "Elena Rostova",
    date: "January 28, 2026",
    rating: 5,
    title: "The texture is pure luxury",
    comment:
      "It absorbs like silk without any heavy residue or stickiness. Makeup applies flawlessly over it. Truly medical-grade results wrapped in luxury packaging.",
    verified: true,
  },
  {
    name: "Amara Kassa",
    date: "January 14, 2026",
    rating: 4,
    title: "High quality and authentic",
    comment:
      "Delivered in pristine condition in Addis Ababa. The formulation is gentle yet noticeably effective for tightening pores and brightening my skin tone.",
    verified: true,
  },
  {
    name: "Chloe Vandenberg",
    date: "December 20, 2025",
    rating: 5,
    title: "Permanent staple in my skincare ritual",
    comment:
      "A little goes such a long way. After a month of consistent use, my hyperpigmentation has faded significantly and my texture is completely smoothed out.",
    verified: true,
  },
];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, openCart } = useCart();
  const { format } = useCurrency();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"desc" | "how" | "ingredients" | "reviews">("desc");
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Review Form Modal State
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerTitle, setReviewerTitle] = useState("");
  const [reviewerComment, setReviewerComment] = useState("");

  const product = useMemo(() => products.find((p) => p.id === id), [id]);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    setActiveImage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
          <Icon name="alert" size={32} />
        </div>
        <h2 className="text-2xl font-bold font-display text-gray-900">Formulation Not Found</h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          The requested botanical formulation could not be located or may have been archived.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-950 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors shadow-sm"
        >
          <span>← Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const gallery = Array.from(
    new Set([product.image, ...(product.images ?? [])].filter((img): img is string => Boolean(img)))
  );

  const related = getRelatedProducts(product);
  const isOutOfStock = product.type === "outofstock";
  const isLowStock = product.reviews < 10 && !isOutOfStock;
  const isWish = isWishlisted(product.id);

  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const discountPercent = hasDiscount
    ? Math.round((((product.compareAtPrice ?? product.price) - product.price) / (product.compareAtPrice ?? product.price)) * 100)
    : 0;
  const savingsAmount = hasDiscount && product.compareAtPrice ? product.compareAtPrice - product.price : 0;

  const handleAdd = () => {
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
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product.id, quantity);
    openCart();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    const newRev: ReviewItem = {
      name: reviewerName.trim(),
      date: "Just now",
      rating: reviewerRating,
      title: reviewerTitle.trim() || "Verified Buyer Experience",
      comment: reviewerComment.trim(),
      verified: true,
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setReviewFormOpen(false);
    setReviewerName("");
    setReviewerTitle("");
    setReviewerComment("");
    showToast({
      title: "Review Submitted",
      message: "Thank you for sharing your botanical experience!",
    });
  };

  const productCode = `ODI-${product.id.slice(0, 6).toUpperCase()}`;

  return (
    <div className="bg-[#f8faf7] min-h-screen py-6 sm:py-10">
      <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Navigation (Doqa style) */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500 font-semibold overflow-x-auto scrollbar-none whitespace-nowrap pb-1" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-emerald-950 transition-colors shrink-0">
            Home
          </Link>
          <span className="shrink-0">/</span>
          <Link to="/" className="hover:text-emerald-950 transition-colors shrink-0">
            Catalog
          </Link>
          <span className="shrink-0">/</span>
          <Link
            to={`/?category=${encodeURIComponent(product.category)}`}
            className="hover:text-emerald-950 transition-colors shrink-0"
          >
            {product.category}
          </Link>
          <span className="shrink-0">/</span>
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>

        {/* Main Dual-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Media Gallery & Quality Assurances */}
          <div className="space-y-6">
            {/* Main Stage Image */}
            <div className="relative aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-md group">
              <ProductImage
                product={product}
                src={gallery[activeImage]}
                priority={true}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                <span className="px-3 py-1 bg-white/95 backdrop-blur-xs font-bold text-xs uppercase tracking-wider text-gray-900 rounded-full border border-gray-200 shadow-xs self-start">
                  {product.category}
                </span>

                {hasDiscount && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-md animate-pulse border border-rose-500/80 self-start">
                    <Icon name="tag" size={12} className="text-amber-300" />
                    <span>{discountPercent}% OFF SPECIAL DEAL</span>
                  </span>
                )}
              </div>

              {/* Top-Right Badges */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <Badge tone={isOutOfStock ? "red" : isLowStock ? "amber" : "green"} size="md">
                  {isOutOfStock ? "Sold Out" : isLowStock ? "Low Stock" : "In Stock"}
                </Badge>

                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    showToast({
                      title: isWish ? "Removed from Wishlist" : "Saved to Wishlist",
                      message: product.name,
                      image: product.image,
                    });
                  }}
                  className={`w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200 flex items-center justify-center shadow-sm transition-all hover:scale-105 ${
                    isWish ? "text-rose-600 bg-rose-50 border-rose-200" : "text-gray-500 hover:text-rose-600"
                  }`}
                  title={isWish ? "Remove from wishlist" : "Add to wishlist"}
                  aria-label="Wishlist"
                >
                  <HeartIcon size={16} filled={isWish} />
                </button>
              </div>

              {/* Location / Atelier Tag at bottom */}
              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] font-semibold bg-[#123d32]/90 text-white px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1.5 shadow-xs">
                  <Icon name="leaf" size={11} className="text-amber-300" />
                  <span>100% Pure Cold-Pressed Botanical Actives</span>
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 transition-all shrink-0 ${
                      activeImage === idx
                        ? "border-[#123d32] shadow-md ring-2 ring-emerald-950/20 scale-102"
                        : "border-gray-200 hover:border-gray-300 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <ProductImage product={product} src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality & Dispatch Assurances (Doqa Style Grid) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center shrink-0 border border-emerald-100">
                  <LeafIcon size={18} />
                </div>
                <div>
                  <strong className="text-xs font-bold text-gray-900 block font-display">
                    100% Certified Clean
                  </strong>
                  <span className="text-[11px] text-gray-500 leading-tight block">
                    Zero sulfates, parabens, synthetic dyes, or toxic fillers.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheckIcon size={18} />
                </div>
                <div>
                  <strong className="text-xs font-bold text-gray-900 block font-display">
                    Clinical-Grade Safety
                  </strong>
                  <span className="text-[11px] text-gray-500 leading-tight block">
                    Dermatologically tested and hypoallergenic certified.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center shrink-0 border border-emerald-100">
                  <TruckIcon size={18} />
                </div>
                <div>
                  <strong className="text-xs font-bold text-gray-900 block font-display">
                    Rapid Climate Dispatch
                  </strong>
                  <span className="text-[11px] text-gray-500 leading-tight block">
                    Orders ship same-day in temperature-protected packaging.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center shrink-0 border border-emerald-100">
                  <RefreshCwIcon size={18} />
                </div>
                <div>
                  <strong className="text-xs font-bold text-gray-900 block font-display">
                    30-Day Radiant Guarantee
                  </strong>
                  <span className="text-[11px] text-gray-500 leading-tight block">
                    Love your skin results or receive a full complimentary return.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Formulation Info & Purchase Action */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              {/* Header meta */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                  <span className="uppercase tracking-wider font-bold text-emerald-800">
                    {product.brand || "Odilia Laboratories"} • {product.category}
                  </span>
                  <span className="font-mono text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                    {productCode}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-gray-950 tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Rating Bar */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarIcon
                        key={i}
                        size={15}
                        className={i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-900 font-display">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-300">•</span>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className="text-xs text-emerald-800 font-bold hover:underline"
                  >
                    {reviewsList.length} Verified Reviews
                  </button>
                  <span className="text-gray-300">•</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Dermatologist Approved
                  </span>
                </div>
              </div>

              {/* Pricing Showcase Block (Doqa Style) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-2">
                {hasDiscount ? (
                  <>
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                      <span>Limited Promotional Offer</span>
                      <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-md font-black">
                        Save {discountPercent}%
                      </span>
                    </div>

                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-base sm:text-lg font-semibold text-gray-400 line-through">
                        {format(product.compareAtPrice ?? product.price)}
                      </span>
                      <strong className="text-3xl sm:text-4xl font-black text-rose-600 font-display">
                        {format(product.price)}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-200 text-xs">
                      <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                        <CheckIcon size={14} className="text-emerald-600" />
                        You save {format(savingsAmount)} on this botanical ritual
                      </span>
                      <span className="text-gray-400 text-[11px]">Tax included</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Retail Price
                      </span>
                      <strong className="text-3xl sm:text-4xl font-black text-[#123d32] font-display">
                        {format(product.price)}
                      </strong>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                        Direct Lab Dispatch
                      </span>
                      <span className="text-xs text-gray-500 block mt-1">Free Delivery &gt; $50</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Short Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Skin Types & Concern Tags */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Targeted Skin Needs:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.skinTypes.map((st) => (
                    <span
                      key={st}
                      className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-2xs"
                    >
                      🌿 {st} Skin
                    </span>
                  ))}
                  <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900">
                    🔬 Non-Comedogenic
                  </span>
                </div>
              </div>

              {/* Live Inventory Status */}
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-emerald-950 font-bold">
                  {isOutOfStock
                    ? "Currently sold out — Batch restocking underway"
                    : "Ready for Dispatch — 14 units available in today's atelier batch"}
                </span>
              </div>

              {/* Quantity Stepper & Add to Bag Actions */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center justify-between sm:justify-start gap-3">
                    {!isOutOfStock && (
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1 shrink-0">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center hover:bg-gray-100"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-bold text-sm font-display text-gray-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => q + 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    )}
                    <span className="sm:hidden text-xs font-semibold text-emerald-800">
                      {isOutOfStock ? "Restocking Batch" : "Ready to Dispatch"}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col min-[440px]:flex-row items-stretch gap-2.5">
                    <button
                      disabled={isOutOfStock}
                      onClick={handleAdd}
                      className={`flex-1 py-3.5 px-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed ${
                        hasDiscount
                          ? "bg-rose-600 hover:bg-rose-700 shadow-rose-900/10"
                          : "bg-[#123d32] hover:bg-[#1a4a3e]"
                      }`}
                    >
                      {added ? (
                        <>
                          <CheckIcon size={16} className="text-white" />
                          <span>Added to Bag!</span>
                        </>
                      ) : (
                        <>
                          <BagIcon size={16} className={hasDiscount ? "text-white" : "text-amber-400"} />
                          <span>{isOutOfStock ? "Sold Out" : "Add to Shopping Bag"}</span>
                        </>
                      )}
                    </button>

                    {!isOutOfStock && (
                      <button
                        onClick={handleBuyNow}
                        className="py-3.5 px-4 sm:px-5 bg-white border border-gray-300 hover:border-gray-900 text-gray-900 rounded-xl font-bold text-xs sm:text-sm transition-colors shrink-0 shadow-2xs min-h-[44px] flex items-center justify-center"
                      >
                        Instant Checkout
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Informational Tabs (Doqa Style Card) */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="flex border-b border-gray-200 bg-gray-50/70 p-1.5 gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
                {[
                  { id: "desc", label: "Science & Formula" },
                  { id: "how", label: "Application Ritual" },
                  { id: "ingredients", label: "Active Ingredients" },
                  { id: "reviews", label: `Reviews (${reviewsList.length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? "bg-white text-emerald-950 shadow-2xs border border-gray-200/80"
                        : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-6">
                {activeTab === "desc" && (
                  <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
                    <h3 className="text-base font-bold text-gray-900 font-display">
                      The Formulation Science Behind {product.name}
                    </h3>
                    <p>
                      Engineered in collaboration with cosmetic biochemists, this clinical formulation
                      combines pure cold-pressed botanicals with bio-fermented actives. Unlike traditional
                      surface-coating treatments, ODILIA's micro-lipid cellular carrier penetrates deep
                      into the epidermal layers to nourish lipid barriers, stimulate collagen integrity, and
                      lock in lasting cellular hydration.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                        <strong className="text-xl font-black text-emerald-950 font-display block">98%</strong>
                        <span className="text-[11px] text-emerald-800">Instant hydration within 10 min</span>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                        <strong className="text-xl font-black text-emerald-950 font-display block">94%</strong>
                        <span className="text-[11px] text-emerald-800">Visible radiance improvement</span>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                        <strong className="text-xl font-black text-emerald-950 font-display block">100%</strong>
                        <span className="text-[11px] text-emerald-800">Non-irritating clinical safety</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "how" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-gray-900 font-display">
                      Recommended Application Ritual
                    </h3>
                    <div className="space-y-3">
                      <div className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="w-6 h-6 rounded-full bg-[#123d32] text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                          1
                        </span>
                        <div>
                          <strong className="text-xs font-bold text-gray-900 block">Cleanse & Tone</strong>
                          <p className="text-xs text-gray-500">
                            Apply to freshly cleansed, slightly damp skin. Spritz with pure botanical essence.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="w-6 h-6 rounded-full bg-[#123d32] text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                          2
                        </span>
                        <div>
                          <strong className="text-xs font-bold text-gray-900 block">Warm & Press</strong>
                          <p className="text-xs text-gray-500">
                            Warm 3–4 drops between fingertips. Smooth and press gently over face, neck, and décolleté in upward motions.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="w-6 h-6 rounded-full bg-[#123d32] text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                          3
                        </span>
                        <div>
                          <strong className="text-xs font-bold text-gray-900 block">Protect & Seal</strong>
                          <p className="text-xs text-gray-500">
                            Follow with barrier recovery moisturizer in the evening, or SPF 50 mineral protection during morning sunlight.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "ingredients" && (
                  <div className="space-y-3 text-xs sm:text-sm text-gray-600">
                    <h3 className="text-base font-bold text-gray-900 font-display">
                      Active Botanical Formulations
                    </h3>
                    <ul className="space-y-2">
                      <li className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <strong className="text-gray-900 font-bold block">100% Pure Plant Squalane & Ceramide NP</strong>
                        <span className="text-xs text-gray-500">
                          Biomimetic lipid restorers that fortify compromised cellular barriers and prevent water loss.
                        </span>
                      </li>
                      <li className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <strong className="text-gray-900 font-bold block">Multi-Molecular Hyaluronic Acid Complex</strong>
                        <span className="text-xs text-gray-500">
                          Penetrates deep into dermal tissues to hydrate on multiple cellular depths simultaneously.
                        </span>
                      </li>
                      <li className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <strong className="text-gray-900 font-bold block">Organic Centella Asiatica (Cica) & Madecassoside</strong>
                        <span className="text-xs text-gray-500">
                          Soothes inflammation, diminishes redness, and stimulates micro-cellular repair.
                        </span>
                      </li>
                    </ul>
                    <p className="text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                      <strong>Full INCI:</strong> Water/Aqua/Eau, Squalane, Glycerin, Niacinamide, Sodium Hyaluronate, Centella Asiatica, Camellia Sinensis, Tocopherol, Ethylhexylglycerin.
                    </p>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-black font-display text-gray-900">
                          {product.rating.toFixed(1)}
                        </span>
                        <div>
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }, (_, i) => (
                              <StarIcon
                                key={i}
                                size={14}
                                className={i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">Based on {reviewsList.length} verified ratings</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setReviewFormOpen(!reviewFormOpen)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-emerald-950 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors shadow-2xs"
                      >
                        {reviewFormOpen ? "Cancel Review" : "Write a Verified Review"}
                      </button>
                    </div>

                    {/* Inline Review Form */}
                    {reviewFormOpen && (
                      <form
                        onSubmit={handleReviewSubmit}
                        className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3 animate-fade-in"
                      >
                        <h4 className="text-sm font-bold text-gray-900 font-display">Share Your Experience</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Your Name</label>
                            <input
                              type="text"
                              required
                              value={reviewerName}
                              onChange={(e) => setReviewerName(e.target.value)}
                              placeholder="e.g. Jessica Miller"
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-700"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Rating</label>
                            <select
                              value={reviewerRating}
                              onChange={(e) => setReviewerRating(Number(e.target.value))}
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-700"
                            >
                              <option value={5}>★★★★★ 5 Stars (Exceptional)</option>
                              <option value={4}>★★★★☆ 4 Stars (Very Good)</option>
                              <option value={3}>★★★☆☆ 3 Stars (Average)</option>
                              <option value={2}>★★☆☆☆ 2 Stars (Below Expectations)</option>
                              <option value={1}>★☆☆☆☆ 1 Star (Disappointing)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Review Headline</label>
                          <input
                            type="text"
                            value={reviewerTitle}
                            onChange={(e) => setReviewerTitle(e.target.value)}
                            placeholder="e.g. Cleared my texture in just two weeks"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-700"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Review Details</label>
                          <textarea
                            rows={3}
                            required
                            value={reviewerComment}
                            onChange={(e) => setReviewerComment(e.target.value)}
                            placeholder="Describe absorption, feel, and visible improvements..."
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-700"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full sm:w-auto px-5 py-2.5 bg-[#123d32] text-white rounded-xl text-xs font-bold hover:bg-[#1a4a3e]"
                        >
                          Submit Verified Review
                        </button>
                      </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-3">
                      {reviewsList.map((rev, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full bg-emerald-950 text-white font-bold text-xs flex items-center justify-center">
                                {rev.name.charAt(0).toUpperCase()}
                              </span>
                              <div>
                                <span className="text-xs font-bold text-gray-900 block">{rev.name}</span>
                                <span className="text-[10px] text-emerald-800 font-bold">✓ Verified Purchase</span>
                              </div>
                            </div>
                            <div className="flex text-amber-400">
                              {Array.from({ length: 5 }, (_, i) => (
                                <StarIcon
                                  key={i}
                                  size={11}
                                  className={i < rev.rating ? "text-amber-400" : "text-gray-200"}
                                />
                              ))}
                            </div>
                          </div>
                          <h5 className="text-xs font-bold text-gray-900 font-display pt-1">{rev.title}</h5>
                          <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                          <span className="text-[10px] text-gray-400 block pt-1">{rev.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Showcase */}
        <section className="space-y-6 pt-10 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Complementary Ritual
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display text-gray-950 tracking-tight">
                Complete Your Botanical Regimen
              </h2>
            </div>
            <Link
              to="/"
              className="text-xs font-bold text-[#123d32] hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Explore Entire Catalog</span>
              <span>→</span>
            </Link>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={addToCart}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </ul>
        </section>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <Footer />
    </div>
  );
}

function getRelatedProducts(product: Product): Product[] {
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c))
  );
  const others = products.filter(
    (p) => p.id !== product.id && !p.categories.some((c) => product.categories.includes(c))
  );
  return [...sameCategory, ...others].slice(0, 4);
}
