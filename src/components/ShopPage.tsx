import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../store/cart";
import { useMobileFilters } from "../store/filters";
import {
  CATEGORIES,
  SKIN_TYPES,
  products,
  priceInUsd,
  type Product,
} from "../data/products";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import Footer from "./Footer";
import Icon, {
  CloseIcon,
  FilterIcon,
  GridViewIcon,
  ListViewIcon,
  StarIcon,
  CheckIcon,
} from "./Icons";

interface ShopFilters {
  search: string;
  categories: string[];
  skinTypes: string[];
  brands: string[];
  maxPrice: number;
  inStockOnly: boolean;
}

type SortKey = "default" | "popularity" | "rating" | "latest" | "price-asc" | "price-desc";

const PAGE_SIZE = 12;
const PRICE_MAX = 200;

const DEFAULT_FILTERS: ShopFilters = {
  search: "",
  categories: [],
  skinTypes: [],
  brands: [],
  maxPrice: PRICE_MAX,
  inStockOnly: false,
};

const RITUAL_TYPES = [
  { id: "All", label: "All Rituals", icon: "✨", keywords: [] },
  { id: "Hydration", label: "Deep Hydration", icon: "💧", keywords: ["hydrat", "hyaluronic", "moist", "water", "mist"] },
  { id: "Radiance", label: "Radiance & Glow", icon: "✨", keywords: ["radiance", "glow", "bright", "vitamin c", "lumiere"] },
  { id: "AntiAging", label: "Anti-Aging & Collagen", icon: "🛡️", keywords: ["collagen", "retinol", "elasticity", "firm", "wrinkle", "renewal"] },
  { id: "Calming", label: "Calming & Sensitive", icon: "🌿", keywords: ["sensitiv", "calm", "cica", "centella", "sooth"] },
  { id: "SunCare", label: "Sun & Defense", icon: "☀️", keywords: ["spf", "sunscreen", "defense", "uv"] },
  { id: "BodyHair", label: "Body & Hair Care", icon: "🧴", keywords: ["body", "hair", "butter", "argan", "rosemary"] },
];

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
  const [filters, setFilters] = useState<ShopFilters>(DEFAULT_FILTERS);
  const [selectedRitual, setSelectedRitual] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("default");
  const [page, setPage] = useState<number>(1);
  const [isListView, setIsListView] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { isOpen: mobileFilters, open: openMobileFilters, close: closeMobileFilters } = useMobileFilters();
  const { addToCart } = useCart();

  // Read URL params
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setFilters((f) => ({ ...f, categories: [cat] }));
      setPage(1);
    }
  }, [searchParams]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      p.categories.forEach((c) => {
        counts[c] = (counts[c] || 0) + 1;
      });
    });
    return counts;
  }, []);

  // Filtered products
  const visible = useMemo(() => {
    return products.filter((p) => {
      // Keyword search
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesCat && !matchesDesc && !matchesBrand) return false;
      }

      // Ritual filter
      if (selectedRitual !== "All") {
        const rit = RITUAL_TYPES.find((r) => r.id === selectedRitual);
        if (rit && rit.keywords.length > 0) {
          const text = `${p.name} ${p.category} ${p.description} ${p.skinTypes.join(" ")}`.toLowerCase();
          const matches = rit.keywords.some((kw) => text.includes(kw));
          if (!matches) return false;
        }
      }

      // Category filter
      if (filters.categories.length > 0 && !p.categories.some((c) => filters.categories.includes(c))) {
        return false;
      }

      // Skin type filter
      if (filters.skinTypes.length > 0 && !p.skinTypes.some((s) => filters.skinTypes.includes(s))) {
        return false;
      }

      // Price filter
      if (priceInUsd(p) > filters.maxPrice) {
        return false;
      }

      // In-stock filter
      if (filters.inStockOnly && p.type === "outofstock") {
        return false;
      }

      return true;
    });
  }, [filters, selectedRitual]);

  // Sorted products
  const sorted = useMemo(() => {
    return [...visible].sort((a, b) => {
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
  }, [visible, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function toggleCategory(cat: string) {
    setPage(1);
    setFilters((f) => {
      const isSelected = f.categories.includes(cat);
      const updated = isSelected ? f.categories.filter((c) => c !== cat) : [...f.categories, cat];
      if (updated.length === 1) {
        setSearchParams({ category: updated[0] });
      } else {
        setSearchParams({});
      }
      return { ...f, categories: updated };
    });
  }

  function toggleSkinType(st: string) {
    setPage(1);
    setFilters((f) => {
      const isSelected = f.skinTypes.includes(st);
      return {
        ...f,
        skinTypes: isSelected ? f.skinTypes.filter((s) => s !== st) : [...f.skinTypes, st],
      };
    });
  }

  function resetAll() {
    setFilters(DEFAULT_FILTERS);
    setSelectedRitual("All");
    setSearchParams({});
    setPage(1);
  }

  const activeFiltersCount =
    filters.categories.length +
    filters.skinTypes.length +
    (filters.search.trim() ? 1 : 0) +
    (selectedRitual !== "All" ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.maxPrice < PRICE_MAX ? 1 : 0);

  return (
    <div className="space-y-8 bg-[#f8faf7] min-h-screen">
      {/* Category Ticker Banner (Doqa Style) */}
      <div className="overflow-hidden bg-[#18352b]/5 py-2.5 border-y border-emerald-950/10">
        <div className="flex gap-8 whitespace-nowrap animate-slide-left text-xs font-bold text-emerald-950">
          {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <span>{item}</span>
              <span className="text-emerald-700/40">•</span>
            </span>
          ))}
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
              <button
                onClick={() => {
                  setFilters({ ...DEFAULT_FILTERS, categories: ["Serums"] });
                  setSelectedRitual("All");
                  setPage(1);
                }}
                className="px-3.5 py-2 bg-white text-emerald-950 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>💧</span>
                <span>Active Serums</span>
              </button>
              <button
                onClick={() => {
                  setFilters({ ...DEFAULT_FILTERS, categories: ["Face Care"] });
                  setSelectedRitual("All");
                  setPage(1);
                }}
                className="px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-500/30 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>🧴</span>
                <span>Face Creams & Balms</span>
              </button>
              <button
                onClick={() => {
                  setFilters({ ...DEFAULT_FILTERS, categories: ["Treatments"] });
                  setSelectedRitual("All");
                  setPage(1);
                }}
                className="px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-500/30 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>☀️</span>
                <span>SPF 50 Shields</span>
              </button>
              <button
                onClick={() => {
                  setFilters({ ...DEFAULT_FILTERS, categories: ["Cleansers"] });
                  setSelectedRitual("All");
                  setPage(1);
                }}
                className="px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-500/30 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>🫧</span>
                <span>AHA Cleansers</span>
              </button>
              <button
                onClick={() => {
                  setFilters({ ...DEFAULT_FILTERS, categories: ["Oils"] });
                  setSelectedRitual("All");
                  setPage(1);
                }}
                className="px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-500/30 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>🌿</span>
                <span>Face & Body Oils</span>
              </button>
            </div>
          </div>

          {/* Ambient Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        </section>

        {/* Main Catalog Section: Sidebar Filters + Products Grid */}
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
                  Filter Formulations
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
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetAll}
                    className="text-xs text-amber-700 hover:text-amber-800 font-bold"
                  >
                    Reset all
                  </button>
                )}
              </div>

              {/* Keyword Search Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Keyword Search</label>
                <div className="relative">
                  <Icon name="search" size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => {
                      setFilters((f) => ({ ...f, search: e.target.value }));
                      setPage(1);
                    }}
                    placeholder="e.g. squalane, serum, spf, cica..."
                    className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-emerald-700 text-gray-900"
                  />
                </div>
              </div>

              {/* Ritual & Concern Quick Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Skincare Ritual</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {RITUAL_TYPES.map((rit) => (
                    <button
                      key={rit.id}
                      onClick={() => {
                        setSelectedRitual(rit.id);
                        setPage(1);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all text-left flex items-center gap-1.5 border ${
                        selectedRitual === rit.id
                          ? "bg-emerald-900 text-white border-emerald-900 shadow-2xs"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200/80"
                      }`}
                    >
                      <span>{rit.icon}</span>
                      <span className="truncate">{rit.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 block">Category</label>
                  {filters.categories.length > 0 && (
                    <button
                      onClick={() => setFilters((f) => ({ ...f, categories: [] }))}
                      className="text-[10px] text-emerald-800 font-bold hover:underline"
                    >
                      Show all
                    </button>
                  )}
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {CATEGORIES.map((cat) => {
                    const isSelected = filters.categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between group ${
                          isSelected
                            ? "bg-emerald-950 text-white font-bold"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <span className="truncate pr-1">{cat}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isSelected
                              ? "bg-amber-400 text-emerald-950"
                              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                          }`}
                        >
                          {categoryCounts[cat] || 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skin Type Filter */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-700 block">Skin Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {SKIN_TYPES.map((st) => {
                    const isSelected = filters.skinTypes.includes(st);
                    return (
                      <button
                        key={st}
                        onClick={() => toggleSkinType(st)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                          isSelected
                            ? "bg-[#123d32] text-amber-300 border-[#123d32]"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter Slider */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-700">Max Price</span>
                  <span className="text-[#123d32] font-mono">${filters.maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={PRICE_MAX}
                  value={filters.maxPrice}
                  onChange={(e) => {
                    setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }));
                    setPage(1);
                  }}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
              </div>

              {/* Stock Availability Toggle */}
              <div className="pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => {
                      setFilters((f) => ({ ...f, inStockOnly: e.target.checked }));
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

          {/* Right Main Grid Area */}
          <div className="layout-content flex-1 min-w-0 w-full space-y-6">
            {/* Quick Ritual Carousel Pills (Doqa Style) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {RITUAL_TYPES.map((rit) => (
                <button
                  key={rit.id}
                  onClick={() => {
                    setSelectedRitual(rit.id);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border shadow-2xs ${
                    selectedRitual === rit.id
                      ? "bg-[#123d32] text-amber-300 border-[#123d32] shadow-sm"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <span>{rit.icon}</span>
                  <span>{rit.label}</span>
                </button>
              ))}
            </div>

            {/* Active Category Banner if filtered */}
            {filters.categories.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Category Filter
                  </span>
                  <strong className="text-base font-bold text-emerald-950 font-display">
                    {filters.categories.join(", ")}
                  </strong>
                  <span className="text-xs text-emerald-700 ml-2">
                    ({visible.length} formulations available)
                  </span>
                </div>
                <button
                  onClick={() => setFilters((f) => ({ ...f, categories: [] }))}
                  className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
                >
                  View all categories
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
                  <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                </button>

                <span className="text-xs font-semibold text-gray-500">
                  Showing <strong className="text-gray-900">{paged.length}</strong> of{" "}
                  <strong className="text-gray-900">{sorted.length}</strong> formulations
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
                    aria-label="Grid view"
                  >
                    <GridViewIcon size={15} />
                  </button>
                  <button
                    onClick={() => setIsListView(true)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isListView ? "bg-white text-gray-900 shadow-2xs" : "text-gray-400 hover:text-gray-700"
                    }`}
                    title="List view"
                    aria-label="List view"
                  >
                    <ListViewIcon size={15} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">Sort:</label>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as any);
                      setPage(1);
                    }}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="default">Featured Formulations</option>
                    <option value="popularity">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="latest">New Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
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
                  onClick={resetAll}
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
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
