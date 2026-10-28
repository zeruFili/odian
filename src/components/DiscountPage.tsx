import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { onSaleProducts, priceInUsd, CATEGORIES, SKIN_TYPES, type Product } from "../data/products";
import { useCart } from "../store/cart";
import { useCurrency } from "../store/currency";
import { useMobileFilters } from "../store/filters";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import Footer from "./Footer";
import Icon, { CloseIcon, FilterIcon, GridViewIcon, ListViewIcon } from "./Icons";

const PAGE_SIZE = 12;
const PRICE_MAX = 200;

type SortKey = "discount-desc" | "savings-desc" | "price-asc" | "price-desc";

export default function DiscountPage() {
  const { format } = useCurrency();
  const { addToCart } = useCart();
  const { isOpen: mobileFilters, open: openMobileFilters, close: closeMobileFilters } = useMobileFilters();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [selectedSkinType, setSelectedSkinType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState<SortKey>("discount-desc");
  const [page, setPage] = useState<number>(1);
  const [isListView, setIsListView] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Lock body scroll when mobile filters are open
  useEffect(() => {
    if (mobileFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFilters]);

  // Discount percentage helper
  const getDiscountPercent = (p: Product) => {
    if (!p.compareAtPrice || p.compareAtPrice <= p.price) return 0;
    return Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
  };

  const getSavings = (p: Product) => {
    if (!p.compareAtPrice || p.compareAtPrice <= p.price) return 0;
    return p.compareAtPrice - p.price;
  };

  // Category counts for on-sale items
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: onSaleProducts.length };
    onSaleProducts.forEach((p) => {
      p.categories.forEach((cat) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, []);

  // Filtered deals
  const filteredDeals = useMemo(() => {
    return onSaleProducts.filter((p) => {
      const discount = getDiscountPercent(p);

      // Tier filter
      if (selectedTier === "30" && discount < 30) return false;
      if (selectedTier === "25" && (discount < 25 || discount >= 30)) return false;
      if (selectedTier === "20" && (discount < 20 || discount >= 25)) return false;
      if (selectedTier === "15" && discount >= 20) return false;

      // Category filter
      if (selectedCategory !== "All" && !p.categories.includes(selectedCategory)) {
        return false;
      }

      // Skin Type filter
      if (selectedSkinType !== "All" && !p.skinTypes.includes(selectedSkinType)) {
        return false;
      }

      // Max Price filter
      if (priceInUsd(p) > maxPrice) {
        return false;
      }

      // In stock
      if (inStockOnly && p.type === "outofstock") return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedTier, selectedSkinType, inStockOnly, searchQuery, maxPrice]);

  // Sorted deals
  const sortedDeals = useMemo(() => {
    return [...filteredDeals].sort((a, b) => {
      if (sortKey === "discount-desc") {
        return getDiscountPercent(b) - getDiscountPercent(a);
      }
      if (sortKey === "savings-desc") {
        return getSavings(b) - getSavings(a);
      }
      if (sortKey === "price-asc") {
        return priceInUsd(a) - priceInUsd(b);
      }
      if (sortKey === "price-desc") {
        return priceInUsd(b) - priceInUsd(a);
      }
      return 0;
    });
  }, [filteredDeals, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedDeals.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedDeals = sortedDeals.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedTier("All");
    setSelectedSkinType("All");
    setSearchQuery("");
    setMaxPrice(PRICE_MAX);
    setInStockOnly(false);
    setSortKey("discount-desc");
    setPage(1);
  };

  const isFiltered =
    selectedCategory !== "All" ||
    selectedTier !== "All" ||
    selectedSkinType !== "All" ||
    searchQuery.trim() !== "" ||
    maxPrice < PRICE_MAX ||
    inStockOnly;

  return (
    <div className="bg-[#f8faf7] min-h-screen py-6 sm:py-8 space-y-8">
      <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-semibold" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-emerald-950 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate">Deals & Specials</span>
        </nav>

        {/* Hero Banner (Doqa Style Deals Banner) */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#123d32] via-[#1a4a3e] to-rose-950 text-white rounded-3xl p-5 sm:p-8 md:p-12 shadow-xl border border-rose-900/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/30 border border-rose-400/40 text-rose-200 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <span>ODILIA BOTANICALS • SPECIAL DEALS & OFFERS</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">UP TO 30% OFF</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Exclusive Botanical Promotions & Sets
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
              Limited-edition formulations and volume ritual sets on special offer. Every formulation displays its original compare-at price, verified discount percentage, and exact customer savings.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Strikethrough Original Pricing</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Accurate % OFF Savings</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Direct Lab Batch Verification</span>
              </div>
            </div>
          </div>

          {/* Decorative Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
        </div>

        {/* Main Section: Side-by-Side Filter Sidebar & Product List in Desktop View */}
        <div className="layout-side-by-side flex flex-col md:flex-row gap-6 lg:gap-8 items-start w-full">
          {/* Left Filter Sidebar (Always side-by-side on desktop) */}
          <aside
            className={`layout-sidebar w-full md:w-64 lg:w-72 xl:w-80 shrink-0 md:sticky md:top-24 z-30 ${
              mobileFilters
                ? "fixed inset-0 z-50 p-4 sm:p-6 bg-white overflow-y-auto block animate-fade-in"
                : "hidden md:block"
            }`}
          >
            {mobileFilters && (
              <div className="sticky top-0 -m-4 sm:-m-6 mb-4 p-4 sm:p-5 bg-white/95 backdrop-blur-md border-b border-gray-200 flex items-center justify-between z-20 md:hidden shadow-xs">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">
                    SPECIAL OFFERS
                  </span>
                  <strong className="text-base font-bold text-gray-900 block font-display">
                    Filter Promotions
                  </strong>
                </div>
                <div className="flex items-center gap-2">
                  {isFiltered && (
                    <button
                      onClick={resetFilters}
                      className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    onClick={closeMobileFilters}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
                    aria-label="Close filters"
                  >
                    <CloseIcon size={20} />
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Deal Filters
                </span>
                {isFiltered && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-rose-700 hover:text-rose-800 font-bold"
                  >
                    Reset all
                  </button>
                )}
              </div>

              {/* Keyword Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Keyword Search</label>
                <div className="relative">
                  <Icon name="search" size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search discounted items..."
                    className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-rose-600 text-gray-900"
                  />
                </div>
              </div>

              {/* Prominent Price Filter (Doqa Style) */}
              <div className="space-y-3 pt-3 border-t border-gray-100 bg-rose-50/50 p-3 rounded-xl border border-rose-900/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon name="tag" size={13} className="text-rose-700" />
                    <label className="text-xs font-bold text-gray-900 block">
                      Price Range
                    </label>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-mono text-xs font-bold shadow-xs">
                    Up to {format(maxPrice)}
                  </span>
                </div>

                <div className="space-y-1">
                  <input
                    type="range"
                    min={10}
                    max={PRICE_MAX}
                    step={5}
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(Number(e.target.value));
                      setPage(1);
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                    aria-label="Filter by maximum price"
                  />
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 font-mono">
                    <span>{format(10)}</span>
                    <span>{format(PRICE_MAX)}</span>
                  </div>
                </div>

                {/* Quick Price Preset Buttons */}
                <div className="grid grid-cols-4 gap-1 pt-0.5">
                  {[
                    { label: "All", max: PRICE_MAX },
                    { label: "< $35", max: 35 },
                    { label: "< $60", max: 60 },
                    { label: "< $100", max: 100 },
                  ].map((p) => {
                    const isSelected = maxPrice === p.max;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setMaxPrice(p.max);
                          setPage(1);
                        }}
                        className={`py-1 px-1 text-[10px] font-bold rounded-lg border text-center transition-all ${
                          isSelected
                            ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                            : "bg-white hover:bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Discount Tier Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Discount Tier</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { id: "All", label: "All Special Offers", badge: `${onSaleProducts.length}` },
                    { id: "30", label: "🔥 30% OFF Mega Deals", badge: `${onSaleProducts.filter((p) => getDiscountPercent(p) >= 30).length}` },
                    { id: "25", label: "⚡ 25% OFF Big Savings", badge: `${onSaleProducts.filter((p) => getDiscountPercent(p) >= 25 && getDiscountPercent(p) < 30).length}` },
                    { id: "20", label: "✨ 20% OFF Popular Deals", badge: `${onSaleProducts.filter((p) => getDiscountPercent(p) >= 20 && getDiscountPercent(p) < 25).length}` },
                    { id: "15", label: "🌿 15% OFF Starter Deals", badge: `${onSaleProducts.filter((p) => getDiscountPercent(p) < 20).length}` },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => {
                        setSelectedTier(tier.id);
                        setPage(1);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between border ${
                        selectedTier === tier.id
                          ? "bg-rose-600 text-white font-bold border-rose-600 shadow-2xs"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200/80"
                      }`}
                    >
                      <span>{tier.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          selectedTier === tier.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {tier.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 block">Category</label>
                  {selectedCategory !== "All" && (
                    <button
                      onClick={() => {
                        setSelectedCategory("All");
                        setPage(1);
                      }}
                      className="text-[10px] text-rose-700 font-bold hover:underline"
                    >
                      Show all
                    </button>
                  )}
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setPage(1);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === "All"
                        ? "bg-emerald-950 text-white font-bold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span>All Categories</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        selectedCategory === "All" ? "bg-amber-400 text-emerald-950" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {onSaleProducts.length}
                    </span>
                  </button>
                  {CATEGORIES.filter((cat) => (categoryCounts[cat] || 0) > 0).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setPage(1);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === cat
                          ? "bg-emerald-950 text-white font-bold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="truncate pr-1">{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          selectedCategory === cat
                            ? "bg-amber-400 text-emerald-950"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {categoryCounts[cat] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Types Filter */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-700 block">Skin Type</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedSkinType("All");
                      setPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      selectedSkinType === "All"
                        ? "bg-[#123d32] text-amber-300 border-[#123d32]"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                    }`}
                  >
                    All Types
                  </button>
                  {SKIN_TYPES.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setSelectedSkinType(st);
                        setPage(1);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        selectedSkinType === st
                          ? "bg-[#123d32] text-amber-300 border-[#123d32]"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Stock Toggle */}
              <div className="pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setPage(1);
                    }}
                    className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs font-semibold text-gray-700">In-Stock Only</span>
                </label>
              </div>

              {mobileFilters && (
                <div className="sticky bottom-0 -m-4 sm:-m-5 mt-4 p-4 sm:p-5 bg-white/95 backdrop-blur-md border-t border-gray-200 z-20 md:hidden shadow-lg">
                  <button
                    onClick={closeMobileFilters}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Apply Deal Filters</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-black text-[11px]">
                      {sortedDeals.length} Offers
                    </span>
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div className="layout-content flex-1 min-w-0 w-full space-y-6">
            {/* Quick Discount Tier Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: "All", label: "All Special Offers", icon: "✨" },
                { id: "30", label: "30% OFF Mega Deals", icon: "🔥" },
                { id: "25", label: "25% OFF Big Savings", icon: "⚡" },
                { id: "20", label: "20% OFF Popular Sets", icon: "✨" },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => {
                    setSelectedTier(tier.id);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border shadow-2xs ${
                    selectedTier === tier.id
                      ? "bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-600/30"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <span>{tier.icon}</span>
                  <span>{tier.label}</span>
                </button>
              ))}
            </div>

            {/* Active Filters Banner */}
            {isFiltered && (
              <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                    Active Discount Filter
                  </span>
                  <strong className="text-sm sm:text-base font-bold text-rose-950 font-display">
                    {selectedTier !== "All" && `${selectedTier}% OFF Tier `}
                    {selectedCategory !== "All" && `• ${selectedCategory} `}
                    {selectedSkinType !== "All" && `• ${selectedSkinType} Skin `}
                    {searchQuery && `• Matching "${searchQuery}"`}
                  </strong>
                  <span className="text-xs text-rose-700 ml-2">
                    ({sortedDeals.length} offers matching)
                  </span>
                </div>
                <button
                  onClick={resetFilters}
                  className="px-3 py-1.5 bg-white border border-rose-300 text-rose-900 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors self-start sm:self-auto"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Toolbar (Doqa Style) */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                <button
                  onClick={openMobileFilters}
                  className="md:hidden px-3 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-98"
                >
                  <FilterIcon size={14} />
                  <span>Filters {isFiltered && "(Active)"}</span>
                </button>

                <span className="text-xs font-semibold text-gray-500">
                  Showing <strong className="text-gray-900">{pagedDeals.length}</strong> of{" "}
                  <strong className="text-gray-900">{sortedDeals.length}</strong> deals
                </span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
                {/* View Switcher */}
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-0.5 shrink-0">
                  <button
                    onClick={() => setIsListView(false)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      !isListView ? "bg-white text-gray-900 shadow-2xs" : "text-gray-400 hover:text-gray-700"
                    }`}
                    title="Grid view"
                  >
                    <GridViewIcon size={15} />
                  </button>
                  <button
                    onClick={() => setIsListView(true)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isListView ? "bg-white text-gray-900 shadow-2xs" : "text-gray-400 hover:text-gray-700"
                    }`}
                    title="List view"
                  >
                    <ListViewIcon size={15} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 flex-1 sm:flex-initial justify-end">
                  <select
                    value={sortKey}
                    onChange={(e) => {
                      setSortKey(e.target.value as any);
                      setPage(1);
                    }}
                    className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-rose-600"
                  >
                    <option value="discount-desc">Highest Discount %</option>
                    <option value="savings-desc">Biggest Savings</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Cards Grid or Empty State */}
            {sortedDeals.length === 0 ? (
              <div className="p-12 bg-white rounded-2xl border border-gray-200 text-center space-y-3">
                <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto text-xl">
                  🏷️
                </div>
                <strong className="text-base font-bold text-gray-900 block font-display">
                  No promotional deals matching these criteria
                </strong>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try loosening your tier or search filters to see all available clinical offers.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : isListView ? (
              <ul className="space-y-4">
                {pagedDeals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addToCart}
                    onQuickView={setQuickViewProduct}
                    listView={true}
                  />
                ))}
              </ul>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {pagedDeals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addToCart}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </ul>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-4 flex-wrap">
                <button
                  disabled={safePage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-gray-200 rounded-xl bg-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 active:scale-98 transition-all"
                >
                  ← Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                        n === safePage
                          ? "bg-rose-600 text-white shadow-xs"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <button
                  disabled={safePage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border border-gray-200 rounded-xl bg-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 active:scale-98 transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <Footer />
    </div>
  );
}
