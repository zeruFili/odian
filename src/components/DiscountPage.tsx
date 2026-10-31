import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { onSaleProducts, priceInUsd, type Product } from "../data/products";
import { useCart } from "../store/cart";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import Footer from "./Footer";
import Icon from "./Icons";
import {
  FilterSidebar,
  RitualPillsCarousel,
  DiscountTierPills,
  ActiveFiltersBanner,
  CatalogSearchFilterBar,
  useProductFilters,
} from "./ProductFilters";

type SortKey = "discount-desc" | "savings-desc" | "price-asc" | "price-desc";

const PAGE_SIZE = 12;

export default function DiscountPage() {
  const { addToCart } = useCart();

  const [sortKey, setSortKey] = useState<SortKey>("discount-desc");
  const [page, setPage] = useState<number>(1);
  const [isListView, setIsListView] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const {
    filters,
    setSearch,
    setMaxPrice,
    setInStockOnly,
    setTier,
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
  } = useProductFilters(onSaleProducts);

  // Discount percentage helper
  const getDiscountPercent = (p: Product) => {
    if (!p.compareAtPrice || p.compareAtPrice <= p.price) return 0;
    return Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
  };

  const getSavings = (p: Product) => {
    if (!p.compareAtPrice || p.compareAtPrice <= p.price) return 0;
    return p.compareAtPrice - p.price;
  };

  // Discount tier counts for on-sale items
  const discountTierCounts = useMemo(() => {
    return {
      All: onSaleProducts.length,
      "30": onSaleProducts.filter((p) => getDiscountPercent(p) >= 30).length,
      "25": onSaleProducts.filter((p) => {
        const d = getDiscountPercent(p);
        return d >= 25 && d < 30;
      }).length,
      "20": onSaleProducts.filter((p) => {
        const d = getDiscountPercent(p);
        return d >= 20 && d < 25;
      }).length,
      "15": onSaleProducts.filter((p) => getDiscountPercent(p) < 20).length,
    };
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, selectedRitual]);

  const handleResetAll = () => {
    resetAll();
    setSortKey("discount-desc");
  };

  const handleToggleFilters = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      openMobileFilters();
    } else {
      setDesktopSidebarOpen((prev) => !prev);
    }
  };

  // Sorted deals
  const sortedDeals = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
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
  }, [filteredItems, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedDeals.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedDeals = sortedDeals.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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

        {/* Main Section: Side-by-Side Filter Sidebar & Product List */}
        <div className="layout-side-by-side flex flex-col md:flex-row gap-6 lg:gap-8 items-start w-full">
          {/* Reusable Left Filter Sidebar with Discount Tiers */}
          <FilterSidebar
            filters={filters}
            selectedRitual={selectedRitual}
            categoryCounts={categoryCounts}
            totalMatching={sortedDeals.length}
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
            showDiscountTiers={true}
            discountTierCounts={discountTierCounts}
            onTierChange={setTier}
            accentTone="rose"
            mobileTitle="SPECIAL OFFERS"
            mobileSubtitle="Filter Promotions"
            sidebarTitle="Deal Filters"
            itemLabel="Offers"
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
                { value: "discount-desc", label: "Featured Curation" },
                { value: "savings-desc", label: "Biggest Savings" },
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

            {/* Reusable Quick Discount Tier Pills */}
            <DiscountTierPills
              selectedTier={filters.tier || "All"}
              onSelectTier={setTier}
            />

            {/* Reusable Active Filters Banner */}
            {isFiltered && (
              <ActiveFiltersBanner
                filters={filters}
                selectedRitual={selectedRitual}
                matchingCount={sortedDeals.length}
                onClear={handleResetAll}
                itemLabel="offers matching"
                accentTone="rose"
              />
            )}

            {/* Results Count Summary */}
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 px-1">
              <span>
                Showing <strong className="text-gray-900">{pagedDeals.length}</strong> of{" "}
                <strong className="text-gray-900">{sortedDeals.length}</strong> deals
              </span>
              {!desktopSidebarOpen && (
                <button
                  type="button"
                  onClick={() => setDesktopSidebarOpen(true)}
                  className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900"
                >
                  Show sidebar filters →
                </button>
              )}
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
                  onClick={handleResetAll}
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
              <ul
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 ${
                  desktopSidebarOpen ? "xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"
                }`}
              >
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