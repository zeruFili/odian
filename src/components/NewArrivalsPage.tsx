import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { newArrivalProducts, priceInUsd, CATEGORIES, SKIN_TYPES, type Product } from "../data/products";
import { useCart } from "../store/cart";
import { useMobileFilters } from "../store/filters";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import Footer from "./Footer";
import Icon, { CloseIcon, FilterIcon, GridViewIcon, ListViewIcon } from "./Icons";

const PAGE_SIZE = 12;
const PRICE_MAX = 200;

type SortKey = "latest" | "popularity" | "rating" | "price-asc" | "price-desc";

export default function NewArrivalsPage() {
  const { addToCart } = useCart();
  const { isOpen: mobileFilters, open: openMobileFilters, close: closeMobileFilters } = useMobileFilters();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSkinType, setSelectedSkinType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState<SortKey>("latest");
  const [page, setPage] = useState<number>(1);
  const [isListView, setIsListView] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Category counts for new arrivals
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: newArrivalProducts.length };
    newArrivalProducts.forEach((p) => {
      p.categories.forEach((cat) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, []);

  // Filtered new arrivals
  const filteredProducts = useMemo(() => {
    return newArrivalProducts.filter((p) => {
      // Category filter
      if (selectedCategory !== "All" && !p.categories.includes(selectedCategory)) {
        return false;
      }

      // Skin type filter
      if (selectedSkinType !== "All" && !p.skinTypes.includes(selectedSkinType)) {
        return false;
      }

      // Max price
      if (priceInUsd(p) > maxPrice) return false;

      // In stock
      if (inStockOnly && p.type === "outofstock") return false;

      // Search query
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
  }, [selectedCategory, selectedSkinType, maxPrice, inStockOnly, searchQuery]);

  // Sorted new arrivals
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortKey) {
        case "popularity":
          return b.reviews - a.reviews;
        case "rating":
          return b.rating - a.rating;
        case "latest":
          return b.id.localeCompare(a.id);
        case "price-asc":
          return priceInUsd(a) - priceInUsd(b);
        case "price-desc":
          return priceInUsd(b) - priceInUsd(a);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedProducts = sortedProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedSkinType("All");
    setSearchQuery("");
    setMaxPrice(PRICE_MAX);
    setInStockOnly(false);
    setSortKey("latest");
    setPage(1);
  };

  const isFiltered =
    selectedCategory !== "All" ||
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
          <span className="text-gray-900 truncate">New Arrivals</span>
        </nav>

        {/* Hero Banner (Doqa Style New Arrivals Banner) */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#123d32] via-[#1a4a3e] to-[#0e3027] text-white rounded-3xl p-5 sm:p-8 md:p-12 shadow-xl border border-emerald-800/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>ODILIA BOTANICALS • NEW ARRIVALS & FORMULATIONS</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Fresh Atelier Extractions & Breakthroughs
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
              Newly perfected clinical formulations engineered to elevate your daily beauty ritual. Sourced from the latest cold-pressed harvests with enhanced bio-ferment potency.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Fresh Lab Batches</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Bio-Fermented Cellular Actives</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Direct Atelier Temperature Dispatch</span>
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
            className={`layout-sidebar w-full md:w-64 lg:w-72 xl:w-80 shrink-0 md:sticky md:top-24 z-10 ${
              mobileFilters
                ? "fixed inset-0 z-50 p-6 bg-white overflow-y-auto block"
                : "hidden md:block"
            }`}
          >
            {mobileFilters && (
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 md:hidden">
                <strong className="text-base font-bold text-gray-900 font-display">
                  Filter New Arrivals
                </strong>
                <button
                  onClick={closeMobileFilters}
                  className="p-1.5 text-gray-400 hover:text-gray-700"
                >
                  <CloseIcon size={20} />
                </button>
              </div>
            )}

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Filters
                </span>
                {isFiltered && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-amber-700 hover:text-amber-800 font-bold"
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
                    placeholder="Search new arrivals..."
                    className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-emerald-700 text-gray-900"
                  />
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
                      className="text-[10px] text-emerald-800 font-bold hover:underline"
                    >
                      Show all
                    </button>
                  )}
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
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
                    <span>All New Formulations</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        selectedCategory === "All" ? "bg-amber-400 text-emerald-950" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {newArrivalProducts.length}
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

              {/* Price Slider */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-700">Max Price</span>
                  <span className="text-[#123d32] font-mono">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={PRICE_MAX}
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
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
                    className="rounded border-gray-300 text-emerald-800 focus:ring-emerald-600"
                  />
                  <span className="text-xs font-semibold text-gray-700">In-Stock Only</span>
                </label>
              </div>

              {mobileFilters && (
                <button
                  onClick={closeMobileFilters}
                  className="w-full py-2.5 bg-emerald-950 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Apply Filters
                </button>
              )}
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div className="layout-content flex-1 min-w-0 w-full space-y-6">
            {/* Quick Category Carousel Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {["All", "Serums", "Face Care", "Treatments", "Cleansers", "Oils"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border shadow-2xs ${
                    selectedCategory === cat
                      ? "bg-[#123d32] text-amber-300 border-[#123d32] shadow-sm ring-2 ring-emerald-900/30"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <span>{cat === "All" ? "✨ All New" : cat}</span>
                </button>
              ))}
            </div>

            {/* Active Filters Banner */}
            {isFiltered && (
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Active Filter
                  </span>
                  <strong className="text-sm sm:text-base font-bold text-emerald-950 font-display">
                    {selectedCategory !== "All" && `${selectedCategory} `}
                    {selectedSkinType !== "All" && `• ${selectedSkinType} Skin `}
                    {searchQuery && `• Matching "${searchQuery}"`}
                  </strong>
                  <span className="text-xs text-emerald-700 ml-2">
                    ({sortedProducts.length} new items matching)
                  </span>
                </div>
                <button
                  onClick={resetFilters}
                  className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Toolbar (Doqa Style) */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={openMobileFilters}
                  className="md:hidden px-3 py-1.5 bg-gray-100 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <FilterIcon size={14} />
                  <span>Filters</span>
                </button>

                <span className="text-xs font-semibold text-gray-500">
                  Showing <strong className="text-gray-900">{pagedProducts.length}</strong> of{" "}
                  <strong className="text-gray-900">{sortedProducts.length}</strong> new arrivals
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* View Switcher */}
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-0.5">
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
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">Sort:</label>
                  <select
                    value={sortKey}
                    onChange={(e) => {
                      setSortKey(e.target.value as any);
                      setPage(1);
                    }}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="latest">Newest Formulations</option>
                    <option value="popularity">Popularity</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Cards Grid or Empty State */}
            {sortedProducts.length === 0 ? (
              <div className="p-12 bg-white rounded-2xl border border-gray-200 text-center space-y-3">
                <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto text-xl">
                  ✨
                </div>
                <strong className="text-base font-bold text-gray-900 block font-display">
                  No new arrivals found matching current filters
                </strong>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try clearing your filters to explore all recent botanical formulations.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-2 px-4 py-2 bg-emerald-950 text-white rounded-xl text-xs font-bold"
                >
                  Clear all filters
                </button>
              </div>
            ) : isListView ? (
              <ul className="space-y-4">
                {pagedProducts.map((product) => (
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
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pagedProducts.map((product) => (
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
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  disabled={safePage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 border border-gray-200 rounded-xl bg-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      n === safePage
                        ? "bg-[#123d32] text-white shadow-xs"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  disabled={safePage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 border border-gray-200 rounded-xl bg-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
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
