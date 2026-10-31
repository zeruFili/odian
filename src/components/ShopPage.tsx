import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../store/cart";
import { products, priceInUsd, type Product } from "../data/products";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import Footer from "./Footer";
import Icon from "./Icons";
import {
  PRICE_MAX,
  FilterSidebar,
  RitualPillsCarousel,
  ActiveFiltersBanner,
  CatalogSearchFilterBar,
  useProductFilters,
} from "./ProductFilters";

type SortKey = "default" | "popularity" | "rating" | "latest" | "price-asc" | "price-desc";

const PAGE_SIZE = 12;

const TICKER_ITEMS = [
  "🌿 100% Cold-Pressed Plant Squalane & Ceramide NP",
  "💧 Multi-Depth Micro-Hyaluronic Cellular Moisture",
  "☀️ Broad-Spectrum Daily SPF 50 Mineral Protection",
  "🔬 Clinical-Grade Formulations Dermatologist Approved",
  "🌸 Organic Bulgarian Rose & Centella Asiatica Elixirs",
  "✨ Visible Skin Transformation in 14 Days Guaranteed",
  "🚚 Express Temperature-Controlled Dispatch",
  "🌿 100% Clean, Vegan & Cruelty-Free Certified",
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortKey>("default");
  const [page, setPage] = useState<number>(1);
  const [isListView, setIsListView] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const { addToCart } = useCart();

  const {
    filters,
    setFilters,
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
  } = useProductFilters(products, {
    initialCategories: searchParams.get("category") ? [searchParams.get("category")!] : [],
  });

  // Read URL params
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && (!filters.categories.includes(cat) || filters.categories.length > 1)) {
      setFilters((f) => ({ ...f, categories: [cat] }));
    }
  }, [searchParams]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, selectedRitual]);

  const handleToggleCategory = (cat: string) => {
    const isSelected = filters.categories.includes(cat);
    const updated = isSelected ? filters.categories.filter((c) => c !== cat) : [...filters.categories, cat];
    if (updated.length === 1) {
      setSearchParams({ category: updated[0] });
    } else {
      setSearchParams({});
    }
    toggleCategory(cat);
  };

  const handleClearCategories = () => {
    setSearchParams({});
    clearCategories();
  };

  const handleResetAll = () => {
    setSearchParams({});
    resetAll();
  };

  const handleToggleFilters = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      openMobileFilters();
    } else {
      setDesktopSidebarOpen((prev) => !prev);
    }
  };

  // Sorted products
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
    <div className="space-y-8 bg-[#f8faf7] min-h-screen">
      {/* Category Ticker Banner (Doqa Style) */}
      <div className="overflow-hidden bg-[#18352b]/5 py-2.5 border-y border-emerald-950/10 select-none">
        <div className="flex w-max animate-marquee text-xs font-bold text-emerald-950">
          <div className="flex items-center gap-8 pr-8 shrink-0">
            {TICKER_ITEMS.map((item, idx) => (
              <span key={`ticker-1-${idx}`} className="flex items-center gap-2">
                <span>{item}</span>
                <span className="text-emerald-700/40">•</span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-8 pr-8 shrink-0" aria-hidden="true">
            {TICKER_ITEMS.map((item, idx) => (
              <span key={`ticker-2-${idx}`} className="flex items-center gap-2">
                <span>{item}</span>
                <span className="text-emerald-700/40">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Showcase Section (Doqa Style) */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#123d32] via-[#1a4a3e] to-[#0e3027] text-white p-5 sm:p-8 md:p-12 shadow-xl border border-emerald-800/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <span>Pure Botanical Science & Formulations</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Direct Atelier Dispatch</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Clinical Botanical Skincare & Luxury Beauty Rituals
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-emerald-100/80 leading-relaxed max-w-2xl">
              Award-winning bio-fermented actives formulated with pure cold-pressed botanicals. Clinically proven
              to awaken natural radiance, fortify lipid barriers, and maintain luminous skin health.
            </p>

            {/* Quick Hero Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {[
                { label: "Active Serums", cat: "Serums", icon: "💧" },
                { label: "Face Creams & Balms", cat: "Face Care", icon: "🧴" },
                { label: "SPF 50 Shields", cat: "Treatments", icon: "☀️" },
                { label: "AHA Cleansers", cat: "Cleansers", icon: "🫧" },
                { label: "Face & Body Oils", cat: "Oils", icon: "🌿" },
              ].map((btn) => (
                <button
                  key={btn.cat}
                  type="button"
                  onClick={() => {
                    setFilters({
                      search: "",
                      categories: [btn.cat],
                      skinTypes: [],
                      maxPrice: PRICE_MAX,
                      inStockOnly: false,
                      tier: "All",
                    });
                    setSelectedRitual("All");
                    setSearchParams({ category: btn.cat });
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 ${
                    filters.categories.includes(btn.cat)
                      ? "bg-white text-emerald-950"
                      : "bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-500/30 text-white"
                  }`}
                >
                  <span>{btn.icon}</span>
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ambient Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        </section>

        {/* Main Catalog Section: Sidebar Filters + Products Grid */}
        <div className="layout-side-by-side flex flex-col md:flex-row gap-6 lg:gap-8 items-start w-full">
          {/* Reusable Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            selectedRitual={selectedRitual}
            categoryCounts={categoryCounts}
            totalMatching={sorted.length}
            activeFiltersCount={activeFiltersCount}
            isOpen={mobileFilters}
            onClose={closeMobileFilters}
            onReset={handleResetAll}
            onSearchChange={setSearch}
            onMaxPriceChange={setMaxPrice}
            onSelectRitual={setSelectedRitual}
            onToggleCategory={handleToggleCategory}
            onClearCategories={handleClearCategories}
            onToggleSkinType={toggleSkinType}
            onInStockChange={setInStockOnly}
            sidebarTitle="Filters"
            itemLabel="Formulations"
            isDesktopVisible={desktopSidebarOpen}
          />

          {/* Right Main Grid Area */}
          <div className="layout-content flex-1 min-w-0 w-full space-y-6">
            {/* Search & Filter Bar - Exact match to user reference */}
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
                { value: "popularity", label: "Most Popular" },
                { value: "rating", label: "Highest Rated" },
                { value: "latest", label: "New Arrivals" },
                { value: "price-asc", label: "Price: Low to High" },
                { value: "price-desc", label: "Price: High to Low" },
              ]}
              isListView={isListView}
              onListViewChange={setIsListView}
            />

            {/* Reusable Quick Ritual Carousel */}
            <RitualPillsCarousel
              selectedRitual={selectedRitual}
              onSelectRitual={setSelectedRitual}
            />

            {/* Reusable Active Filters Banner */}
            {isFiltered && (
              <ActiveFiltersBanner
                filters={filters}
                selectedRitual={selectedRitual}
                matchingCount={sorted.length}
                onClear={handleResetAll}
                itemLabel="formulations available"
              />
            )}

            {/* Results Count Summary */}
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 px-1">
              <span>
                Showing <strong className="text-gray-900">{paged.length}</strong> of{" "}
                <strong className="text-gray-900">{sorted.length}</strong> formulations
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

            {/* Products Grid or Empty State */}
            {sorted.length === 0 ? (
              <div className="p-12 bg-white rounded-2xl border border-gray-200 text-center space-y-3">
                <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
                  <Icon name="search" size={24} />
                </div>
                <strong className="text-base font-bold text-gray-900 block font-display">
                  No matching formulations found
                </strong>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try clearing your skin type, category, or search filters to explore other botanical remedies.
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
                          ? "bg-[#123d32] text-amber-300 shadow-xs"
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

        {/* Promotional VIP Club Banner (Doqa Style) */}
        <section className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-5 sm:p-8 md:p-10 text-emerald-950 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-white px-2.5 py-0.5 rounded-full inline-block">
              Customized Skin Consultations & Sets
            </span>
            <h3 className="text-2xl md:text-3xl font-black font-display tracking-tight text-emerald-950">
              Personalized Multi-Week Botanical Rituals
            </h3>
            <p className="text-xs md:text-sm text-emerald-950/80 leading-relaxed">
              Looking to target hyperpigmentation, dry skin barrier damage, or deep cellular renewal? Enjoy up to 25% off complete 3-step ritual sets with complimentary consultation and ongoing check-ins.
            </p>
          </div>

          <Link
            to="/discount"
            className="px-6 py-3 bg-emerald-950 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-md transition-colors whitespace-nowrap"
          >
            Explore Special Offers →
          </Link>
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