import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../store/cart";
import { priceInUsd, type Product } from "../data/products";
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

type SortKey = "default" | "popularity" | "rating" | "latest" | "price-asc" | "price-desc";

const PAGE_SIZE = 12;

interface CollectionProps {
  title: string;
  subtitle: string;
  crumb: string;
  items: Product[];
  accent?: string;
  heroBadge?: string;
}

export default function CollectionPage({
  title,
  subtitle,
  crumb,
  items,
  heroBadge = "Curated Collection",
}: CollectionProps) {
  const { addToCart } = useCart();

  const [sort, setSort] = useState<SortKey>("default");
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
  } = useProductFilters(items);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, selectedRitual]);

  const handleToggleFilters = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      openMobileFilters();
    } else {
      setDesktopSidebarOpen((prev) => !prev);
    }
  };

  // Sorted items
  const sorted = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      switch (sort) {
        case "popularity":
          return b.reviews - a.reviews;
        case "rating":
          return b.rating - a.rating;
        case "latest":
          return b.badge === "new" ? -1 : 1;
        case "price-asc":
          return priceInUsd(a) - priceInUsd(b);
        case "price-desc":
          return priceInUsd(b) - priceInUsd(a);
        default:
          return 0;
      }
    });
  }, [filteredItems, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="bg-[#f8faf7] min-h-screen py-6 sm:py-8 space-y-8">
      <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-semibold" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-emerald-950 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{crumb}</span>
        </nav>

        {/* Hero Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#123d32] via-[#1a4a3e] to-[#0e3027] text-white rounded-3xl p-5 sm:p-8 md:p-12 shadow-xl border border-emerald-800/40">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{heroBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 leading-relaxed">
              {subtitle}
            </p>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
        </div>

        {/* Main Section: Side-by-Side Filter Sidebar & Product List */}
        <div className="layout-side-by-side flex flex-col md:flex-row gap-6 lg:gap-8 items-start w-full">
          {/* Left Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            selectedRitual={selectedRitual}
            categoryCounts={categoryCounts}
            totalMatching={sorted.length}
            activeFiltersCount={activeFiltersCount}
            isOpen={mobileFilters}
            onClose={closeMobileFilters}
            onReset={resetAll}
            onSearchChange={setSearch}
            onMaxPriceChange={setMaxPrice}
            onSelectRitual={setSelectedRitual}
            onToggleCategory={toggleCategory}
            onClearCategories={clearCategories}
            onToggleSkinType={toggleSkinType}
            onInStockChange={setInStockOnly}
            mobileTitle="COLLECTION FILTERS"
            mobileSubtitle="Filter Formulations"
            sidebarTitle="Filters"
            itemLabel="Products"
            isDesktopVisible={desktopSidebarOpen}
          />

          {/* Right Main Grid Area */}
          <div className="layout-content flex-1 min-w-0 w-full space-y-6">
            {/* Search & Filter Bar (Matching user reference) */}
            <CatalogSearchFilterBar
              searchValue={filters.search}
              onSearchChange={setSearch}
              searchPlaceholder="Search silhouettes, designers, SKU..."
              onOpenFilters={handleToggleFilters}
              activeFiltersCount={activeFiltersCount}
              sortKey={sort}
              onSortChange={(val) => {
                setSort(val as any);
                setPage(1);
              }}
              sortOptions={[
                { value: "default", label: "Featured Curation" },
                { value: "popularity", label: "Popularity" },
                { value: "rating", label: "Average Rating" },
                { value: "latest", label: "New Arrivals" },
                { value: "price-asc", label: "Price: Low to High" },
                { value: "price-desc", label: "Price: High to Low" },
              ]}
              isListView={isListView}
              onListViewChange={setIsListView}
            />

            {/* Quick Ritual Carousel Pills */}
            <RitualPillsCarousel
              selectedRitual={selectedRitual}
              onSelectRitual={setSelectedRitual}
            />

            {/* Active Filters Banner */}
            {isFiltered && (
              <ActiveFiltersBanner
                filters={filters}
                selectedRitual={selectedRitual}
                matchingCount={sorted.length}
                onClear={resetAll}
                itemLabel="products matching"
              />
            )}

            {/* Results Count Summary */}
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 px-1">
              <span>
                Showing <strong className="text-gray-900">{paged.length}</strong> of{" "}
                <strong className="text-gray-900">{sorted.length}</strong> products
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

            {/* Products Grid / List */}
            {sorted.length === 0 ? (
              <div className="p-12 bg-white rounded-2xl border border-gray-200 text-center space-y-3">
                <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
                  <Icon name="search" size={24} />
                </div>
                <strong className="text-base font-bold text-gray-900 block font-display">
                  No products found in this collection
                </strong>
                <Link to="/" className="inline-block mt-2 px-4 py-2 bg-emerald-950 text-white rounded-xl text-xs font-bold">
                  Return to Catalog
                </Link>
              </div>
            ) : isListView ? (
              <ul className="space-y-4">
                {paged.map((product) => (
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
                {paged.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addToCart}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </ul>
            )}

            {/* Pagination */}
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