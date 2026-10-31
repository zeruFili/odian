import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { newArrivalProducts, priceInUsd, type Product } from "../data/products";
import { useCart } from "../store/cart";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import Footer from "./Footer";
import Icon from "./Icons";
import {
  FilterSidebar,
  RitualPillsCarousel,
  ActiveFiltersBanner,
  CatalogSearchFilterBar,
  useProductFilters,
} from "./ProductFilters";

type SortKey = "latest" | "popularity" | "rating" | "price-asc" | "price-desc";

const PAGE_SIZE = 12;

export default function NewArrivalsPage() {
  const { addToCart } = useCart();

  const [sortKey, setSortKey] = useState<SortKey>("latest");
  const [page, setPage] = useState<number>(1);
  const [isListView, setIsListView] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const {
    filters,
    setSearch,
    setMaxPrice,
    setInStockOnly,
    clearCategories,
    selectedRitual,
    setSelectedRitual,
    toggleCategory,
    toggleSkinType,
    resetAll,
    activeFiltersCount,
    isFiltered,
    filteredItems,
    categoryCounts,
    mobileFilters,
    openMobileFilters,
    closeMobileFilters,
  } = useProductFilters(newArrivalProducts);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, selectedRitual]);

  const handleResetAll = () => {
    resetAll();
    setSortKey("latest");
  };

  const handleToggleFilters = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      openMobileFilters();
    } else {
      setDesktopSidebarOpen((prev) => !prev);
    }
  };

  // Sorted new arrivals
  const sortedProducts = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
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
  }, [filteredItems, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedProducts = sortedProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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

        {/* Main Section: Side-by-Side Filter Sidebar & Product List */}
        <div className="layout-side-by-side flex flex-col md:flex-row gap-6 lg:gap-8 items-start w-full">
          {/* Reusable Left Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            selectedRitual={selectedRitual}
            categoryCounts={categoryCounts}
            totalMatching={sortedProducts.length}
            activeFiltersCount={activeFiltersCount}
            isOpen={mobileFilters}
            onClose={closeMobileFilters}
            onReset={handleResetAll}
            onSearchChange={setSearch}
            onMaxPriceChange={setMaxPrice}
            onSelectRitual={setSelectedRitual}
            onToggleCategory={toggleCategory}
            onClearCategories={clearCategories}
            onToggleSkinType={toggleSkinType}
            onInStockChange={setInStockOnly}
            mobileTitle="NEW RELEASES"
            mobileSubtitle="Filter Formulations"
            sidebarTitle="Filters"
            itemLabel="New Arrivals"
            isDesktopVisible={desktopSidebarOpen}
          />

          {/* Right Product Grid Area */}
          <div className="layout-content flex-1 min-w-0 w-full space-y-6">
            {/* Search & Filter Bar (Matching user reference) */}
            <CatalogSearchFilterBar
              searchValue={filters.search}
              onSearchChange={setSearch}
              searchPlaceholder="Search silhouettes, designers, SKU..."
              onOpenFilters={handleToggleFilters}
              activeFiltersCount={activeFiltersCount}
              sortKey={sortKey}
              onSortChange={(val) => {
                setSortKey(val as any);
                setPage(1);
              }}
              sortOptions={[
                { value: "latest", label: "Featured Curation" },
                { value: "popularity", label: "Popularity" },
                { value: "rating", label: "Highest Rated" },
                { value: "price-asc", label: "Price: Low to High" },
                { value: "price-desc", label: "Price: High to Low" },
              ]}
              isListView={isListView}
              onListViewChange={setIsListView}
            />

            {/* Reusable Quick Ritual Carousel Pills */}
            <RitualPillsCarousel
              selectedRitual={selectedRitual}
              onSelectRitual={setSelectedRitual}
            />

            {/* Reusable Active Filters Banner */}
            {isFiltered && (
              <ActiveFiltersBanner
                filters={filters}
                selectedRitual={selectedRitual}
                matchingCount={sortedProducts.length}
                onClear={handleResetAll}
                itemLabel="new items matching"
              />
            )}

            {/* Results Count Summary */}
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 px-1">
              <span>
                Showing <strong className="text-gray-900">{pagedProducts.length}</strong> of{" "}
                <strong className="text-gray-900">{sortedProducts.length}</strong> new arrivals
              </span>
              {!desktopSidebarOpen && (
                <button
                  type="button"
                  onClick={() => setDesktopSidebarOpen(true)}
                  className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950"
                >
                  Show sidebar filters →
                </button>
              )}
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
                  onClick={handleResetAll}
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
              <ul
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 ${
                  desktopSidebarOpen ? "xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"
                }`}
              >
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
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-4 flex-wrap">
                <button
                  disabled={safePage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1.5 border border-gray-200 rounded-xl bg-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
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
                  className="px-2.5 py-1.5 border border-gray-200 rounded-xl bg-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
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