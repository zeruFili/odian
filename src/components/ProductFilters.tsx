import React, { useEffect, useMemo, useState } from "react";
import { CATEGORIES, SKIN_TYPES, priceInUsd, type Product } from "../data/products";
import { useCurrency } from "../store/currency";
import { useMobileFilters } from "../store/filters";
import Icon, {
  CloseIcon,
  SearchIcon,
  FunnelIcon,
  ChevronDownIcon,
  GridViewIcon,
  ListViewIcon,
} from "./Icons";

export interface RitualType {
  id: string;
  label: string;
  icon: string;
  keywords: string[];
}

export const RITUAL_TYPES: RitualType[] = [
  { id: "All", label: "All Rituals", icon: "✨", keywords: [] },
  { id: "Hydration", label: "Deep Hydration", icon: "💧", keywords: ["hydrat", "hyaluronic", "moist", "water", "mist"] },
  { id: "Radiance", label: "Radiance & Glow", icon: "✨", keywords: ["radiance", "glow", "bright", "vitamin c", "lumiere"] },
  { id: "AntiAging", label: "Anti-Aging & Collagen", icon: "🛡️", keywords: ["collagen", "retinol", "elasticity", "firm", "wrinkle", "renewal"] },
  { id: "Calming", label: "Calming & Sensitive", icon: "🌿", keywords: ["sensitiv", "calm", "cica", "centella", "sooth"] },
  { id: "SunCare", label: "Sun & Defense", icon: "☀️", keywords: ["spf", "sunscreen", "defense", "uv"] },
  { id: "BodyHair", label: "Body & Hair Care", icon: "🧴", keywords: ["body", "hair", "butter", "argan", "rosemary"] },
];

export const PRICE_MAX = 200;

export interface FilterState {
  search: string;
  categories: string[];
  skinTypes: string[];
  maxPrice: number;
  inStockOnly: boolean;
  tier?: string;
}

export const DEFAULT_FILTERS: FilterState = {
  search: "",
  categories: [],
  skinTypes: [],
  maxPrice: PRICE_MAX,
  inStockOnly: false,
  tier: "All",
};

export interface FilterSidebarProps {
  filters: FilterState;
  selectedRitual: string;
  categoryCounts: Record<string, number>;
  totalMatching: number;
  activeFiltersCount: number;
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  onSearchChange: (search: string) => void;
  onMaxPriceChange: (maxPrice: number) => void;
  onSelectRitual: (ritualId: string) => void;
  onToggleCategory: (category: string) => void;
  onClearCategories: () => void;
  onToggleSkinType: (skinType: string) => void;
  onInStockChange: (inStockOnly: boolean) => void;
  // Optional customizations
  searchPlaceholder?: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  sidebarTitle?: string;
  itemLabel?: string;
  showDiscountTiers?: boolean;
  discountTierCounts?: Record<string, number>;
  onTierChange?: (tier: string) => void;
  accentTone?: "emerald" | "rose";
  isDesktopVisible?: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  selectedRitual,
  categoryCounts,
  totalMatching,
  activeFiltersCount,
  isOpen,
  onClose,
  onReset,
  onSearchChange,
  onMaxPriceChange,
  onSelectRitual,
  onToggleCategory,
  onClearCategories,
  onToggleSkinType,
  onInStockChange,
  searchPlaceholder = "e.g. squalane, serum, spf, cica...",
  mobileTitle = "ODILIA FILTERS",
  mobileSubtitle = "Filter Formulations",
  sidebarTitle = "Filters",
  itemLabel = "Formulations",
  showDiscountTiers = false,
  discountTierCounts,
  onTierChange,
  accentTone = "emerald",
  isDesktopVisible = true,
}) => {
  const { format } = useCurrency();
  const isEmerald = accentTone === "emerald";

  return (
    <aside
      className={`layout-sidebar w-full md:w-64 lg:w-72 xl:w-80 shrink-0 md:sticky md:top-24 z-30 ${
        isOpen
          ? "fixed inset-0 z-50 p-4 sm:p-6 bg-white overflow-y-auto block animate-fade-in"
          : isDesktopVisible
          ? "hidden md:block"
          : "hidden"
      }`}
    >
      {/* Mobile Drawer Top Header */}
      {isOpen && (
        <div className="sticky top-0 -m-4 sm:-m-6 mb-4 p-4 sm:p-5 bg-white/95 backdrop-blur-md border-b border-gray-200 flex items-center justify-between z-20 md:hidden shadow-xs">
          <div>
            <span
              className={`text-[10px] font-black uppercase tracking-wider ${
                isEmerald ? "text-emerald-800" : "text-rose-700"
              }`}
            >
              {mobileTitle}
            </span>
            <strong className="text-base font-bold text-gray-900 block font-display">
              {mobileSubtitle}
            </strong>
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={onReset}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  isEmerald
                    ? "bg-amber-50 text-amber-900 border-amber-200"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                Reset ({activeFiltersCount})
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
              aria-label="Close filters"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Sidebar Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
        {/* Desktop Sidebar Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
            {sidebarTitle} {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </span>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className={`text-xs font-bold ${
                isEmerald
                  ? "text-amber-700 hover:text-amber-800"
                  : "text-rose-700 hover:text-rose-800"
              }`}
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
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className={`w-full pl-8 pr-7 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none text-gray-900 ${
                isEmerald ? "focus:ring-1 focus:ring-emerald-700" : "focus:ring-1 focus:ring-rose-600"
              }`}
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 p-0.5"
                aria-label="Clear keyword search"
              >
                <CloseIcon size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Prominent Price Filter (Doqa Style) */}
        <div
          className={`space-y-3 pt-3 border-t border-gray-100 p-3 rounded-xl border ${
            isEmerald
              ? "bg-emerald-50/40 border-emerald-900/10"
              : "bg-rose-50/50 border-rose-900/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Icon
                name="tag"
                size={13}
                className={isEmerald ? "text-emerald-800" : "text-rose-700"}
              />
              <label className="text-xs font-bold text-gray-900 block">Price Range</label>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold shadow-xs ${
                isEmerald
                  ? "bg-emerald-950 text-amber-300"
                  : "bg-rose-600 text-white"
              }`}
            >
              Up to {format(filters.maxPrice)}
            </span>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min={10}
              max={PRICE_MAX}
              step={5}
              value={filters.maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${
                isEmerald ? "accent-[#123d32]" : "accent-rose-600"
              }`}
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
              const isSelected = filters.maxPrice === p.max;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onMaxPriceChange(p.max)}
                  className={`py-1 px-1 text-[10px] font-bold rounded-lg border text-center transition-all ${
                    isSelected
                      ? isEmerald
                        ? "bg-[#123d32] text-amber-300 border-[#123d32] shadow-2xs"
                        : "bg-rose-600 text-white border-rose-600 shadow-2xs"
                      : "bg-white hover:bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Discount Tier Filter */}
        {showDiscountTiers && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-700 block">Discount Tier</label>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: "All", label: "All Special Offers", badge: discountTierCounts?.All ?? 0 },
                { id: "30", label: "🔥 30% OFF Mega Deals", badge: discountTierCounts?.["30"] ?? 0 },
                { id: "25", label: "⚡ 25% OFF Big Savings", badge: discountTierCounts?.["25"] ?? 0 },
                { id: "20", label: "✨ 20% OFF Popular Deals", badge: discountTierCounts?.["20"] ?? 0 },
                { id: "15", label: "🌿 15% OFF Starter Deals", badge: discountTierCounts?.["15"] ?? 0 },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => onTierChange?.(tier.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between border ${
                    filters.tier === tier.id
                      ? "bg-rose-600 text-white font-bold border-rose-600 shadow-2xs"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200/80"
                  }`}
                >
                  <span>{tier.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      filters.tier === tier.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {tier.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ritual & Concern Quick Buttons (Doqa Style) */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-700 block">Skincare Ritual</label>
          <div className="grid grid-cols-2 gap-1.5">
            {RITUAL_TYPES.map((rit) => (
              <button
                key={rit.id}
                type="button"
                onClick={() => onSelectRitual(rit.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all text-left flex items-center gap-1.5 border ${
                  selectedRitual === rit.id
                    ? isEmerald
                      ? "bg-emerald-900 text-white border-emerald-900 shadow-2xs"
                      : "bg-[#123d32] text-amber-300 border-[#123d32] shadow-2xs"
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
                type="button"
                onClick={onClearCategories}
                className={`text-[10px] font-bold hover:underline ${
                  isEmerald ? "text-emerald-800" : "text-rose-700"
                }`}
              >
                Show all
              </button>
            )}
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {CATEGORIES.filter((cat) => (categoryCounts[cat] || 0) > 0).map((cat) => {
              const isSelected = filters.categories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onToggleCategory(cat)}
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
                  type="button"
                  onClick={() => onToggleSkinType(st)}
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

        {/* Stock Availability Toggle */}
        <div className="pt-2 border-t border-gray-100">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onInStockChange(e.target.checked)}
              className={`rounded border-gray-300 ${
                isEmerald
                  ? "text-emerald-800 focus:ring-emerald-600"
                  : "text-rose-600 focus:ring-rose-500"
              }`}
            />
            <span className="text-xs font-semibold text-gray-700">In-Stock Only</span>
          </label>
        </div>

        {/* Sticky Mobile Apply Button */}
        {isOpen && (
          <div className="sticky bottom-0 -m-4 sm:-m-5 mt-4 p-4 sm:p-5 bg-white/95 backdrop-blur-md border-t border-gray-200 z-20 md:hidden shadow-lg">
            <button
              type="button"
              onClick={onClose}
              className={`w-full py-3 text-white rounded-xl text-xs font-bold shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 ${
                isEmerald
                  ? "bg-[#123d32] hover:bg-[#1a4a3e]"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              <span>Apply Filters</span>
              <span
                className={`px-2 py-0.5 rounded-full font-black text-[11px] ${
                  isEmerald
                    ? "bg-amber-400 text-emerald-950"
                    : "bg-white/20 text-white"
                }`}
              >
                {totalMatching} {itemLabel}
              </span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export interface RitualPillsCarouselProps {
  selectedRitual: string;
  onSelectRitual: (ritualId: string) => void;
  className?: string;
}

export const RitualPillsCarousel: React.FC<RitualPillsCarouselProps> = ({
  selectedRitual,
  onSelectRitual,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none ${className}`}>
      {RITUAL_TYPES.map((rit) => (
        <button
          key={rit.id}
          type="button"
          onClick={() => onSelectRitual(rit.id)}
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
  );
};

export const DISCOUNT_TIERS = [
  { id: "All", label: "All Special Offers", icon: "✨" },
  { id: "30", label: "30% OFF Mega Deals", icon: "🔥" },
  { id: "25", label: "25% OFF Big Savings", icon: "⚡" },
  { id: "20", label: "20% OFF Popular Deals", icon: "✨" },
  { id: "15", label: "15% OFF Starter Deals", icon: "🌿" },
];

export interface DiscountTierPillsProps {
  selectedTier: string;
  onSelectTier: (tierId: string) => void;
  className?: string;
}

export const DiscountTierPills: React.FC<DiscountTierPillsProps> = ({
  selectedTier,
  onSelectTier,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none ${className}`}>
      {DISCOUNT_TIERS.slice(0, 4).map((tier) => (
        <button
          key={tier.id}
          type="button"
          onClick={() => onSelectTier(tier.id)}
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
  );
};

export interface SortOption {
  value: string;
  label: string;
}

export const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { value: "default", label: "Featured Curation" },
  { value: "popularity", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "latest", label: "New Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export interface CatalogSearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onOpenFilters: () => void;
  activeFiltersCount?: number;
  sortKey: string;
  onSortChange: (sortKey: string) => void;
  sortOptions?: SortOption[];
  isListView: boolean;
  onListViewChange: (isList: boolean) => void;
  className?: string;
}

export const CatalogSearchFilterBar: React.FC<CatalogSearchFilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search silhouettes, designers, SKU...",
  onOpenFilters,
  activeFiltersCount = 0,
  sortKey,
  onSortChange,
  sortOptions = DEFAULT_SORT_OPTIONS,
  isListView,
  onListViewChange,
  className = "",
}) => {
  return (
    <div
      className={`bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-2xs space-y-3 ${className}`}
    >
      {/* Row 1: Search Input */}
      <div className="relative">
        <SearchIcon
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-9 py-2.5 sm:py-3 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl sm:rounded-2xl text-gray-900 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 transition-all shadow-2xs"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            aria-label="Clear search"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>

      {/* Row 2: Controls (Filters button, Sort dropdown, View Switcher) */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {/* Filters Pill Button with Dark Green background & Yellow Funnel */}
          <button
            type="button"
            onClick={onOpenFilters}
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#123d32] hover:bg-[#1a4a3e] active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <FunnelIcon size={15} className="text-amber-400 shrink-0" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-400 text-emerald-950 font-black text-[10px]">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortKey}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 pr-8 text-xs sm:text-sm font-bold text-gray-900 outline-none focus:ring-1 focus:ring-emerald-800 cursor-pointer transition-all shadow-2xs"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
            />
          </div>
        </div>

        {/* View Switcher Toggle Pill */}
        <div className="flex items-center border border-gray-200/90 rounded-xl bg-gray-100/80 p-0.5 sm:p-1 shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => onListViewChange(false)}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              !isListView
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-400 hover:text-gray-700"
            }`}
            title="Grid view"
            aria-label="Grid view"
          >
            <GridViewIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => onListViewChange(true)}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              isListView
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-400 hover:text-gray-700"
            }`}
            title="List view"
            aria-label="List view"
          >
            <ListViewIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export interface ActiveFiltersBannerProps {
  filters: FilterState;
  selectedRitual?: string;
  matchingCount: number;
  onClear: () => void;
  itemLabel?: string;
  accentTone?: "emerald" | "rose";
}

export const ActiveFiltersBanner: React.FC<ActiveFiltersBannerProps> = ({
  filters,
  selectedRitual = "All",
  matchingCount,
  onClear,
  itemLabel = "items matching",
  accentTone = "emerald",
}) => {
  const { format } = useCurrency();
  const isEmerald = accentTone === "emerald";

  return (
    <div
      className={`border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isEmerald ? "bg-emerald-50 border-emerald-200/80" : "bg-rose-50 border-rose-200/80"
      }`}
    >
      <div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider block ${
            isEmerald ? "text-emerald-800" : "text-rose-800"
          }`}
        >
          Active Filters
        </span>
        <strong
          className={`text-sm sm:text-base font-bold font-display ${
            isEmerald ? "text-emerald-950" : "text-rose-950"
          }`}
        >
          {filters.tier && filters.tier !== "All" && `${filters.tier}% OFF Tier `}
          {filters.categories.length > 0 && `${filters.categories.join(", ")} `}
          {selectedRitual !== "All" && `• ${selectedRitual} Ritual `}
          {filters.skinTypes.length > 0 && `• ${filters.skinTypes.join(", ")} Skin `}
          {filters.search && `• Matching "${filters.search}" `}
          {filters.maxPrice < PRICE_MAX && `• Under ${format(filters.maxPrice)} `}
          {filters.inStockOnly && `• In-Stock Only`}
        </strong>
        <span className={`text-xs ml-2 ${isEmerald ? "text-emerald-700" : "text-rose-700"}`}>
          ({matchingCount} {itemLabel})
        </span>
      </div>
      <button
        type="button"
        onClick={onClear}
        className={`px-3 py-1.5 bg-white border rounded-xl text-xs font-bold transition-colors self-start sm:self-auto ${
          isEmerald
            ? "border-emerald-300 text-emerald-900 hover:bg-emerald-100"
            : "border-rose-300 text-rose-900 hover:bg-rose-100"
        }`}
      >
        Clear filters
      </button>
    </div>
  );
};

export function useProductFilters<T extends Product>(
  items: T[],
  options?: {
    defaultTier?: string;
    priceMax?: number;
    initialCategories?: string[];
  }
) {
  const priceMax = options?.priceMax ?? PRICE_MAX;
  const { isOpen: mobileFilters, open: openMobileFilters, close: closeMobileFilters } = useMobileFilters();

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: options?.initialCategories || [],
    skinTypes: [],
    maxPrice: priceMax,
    inStockOnly: false,
    tier: options?.defaultTier || "All",
  });

  const [selectedRitual, setSelectedRitual] = useState<string>("All");

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

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: items.length };
    items.forEach((p) => {
      p.categories.forEach((cat) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((p) => {
      // Tier filter if tier is provided
      if (filters.tier && filters.tier !== "All") {
        const compare = p.compareAtPrice ?? p.price;
        const discount = compare > p.price ? Math.round(((compare - p.price) / compare) * 100) : 0;
        if (filters.tier === "30" && discount < 30) return false;
        if (filters.tier === "25" && (discount < 25 || discount >= 30)) return false;
        if (filters.tier === "20" && (discount < 20 || discount >= 25)) return false;
        if (filters.tier === "15" && discount >= 20) return false;
      }

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

      // Category filter (multi-select)
      if (filters.categories.length > 0 && !p.categories.some((c) => filters.categories.includes(c))) {
        return false;
      }

      // Skin type filter (multi-select)
      if (filters.skinTypes.length > 0 && !p.skinTypes.some((s) => filters.skinTypes.includes(s))) {
        return false;
      }

      // Max price
      if (priceInUsd(p) > filters.maxPrice) return false;

      // In stock
      if (filters.inStockOnly && p.type === "outofstock") return false;

      return true;
    });
  }, [items, filters, selectedRitual]);

  const activeFiltersCount =
    filters.categories.length +
    filters.skinTypes.length +
    (filters.search.trim() ? 1 : 0) +
    (selectedRitual !== "All" ? 1 : 0) +
    (filters.tier && filters.tier !== "All" ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.maxPrice < priceMax ? 1 : 0);

  const isFiltered = activeFiltersCount > 0;

  const toggleCategory = (cat: string) => {
    setFilters((f) => {
      const isSelected = f.categories.includes(cat);
      return {
        ...f,
        categories: isSelected ? f.categories.filter((c) => c !== cat) : [...f.categories, cat],
      };
    });
  };

  const toggleSkinType = (st: string) => {
    setFilters((f) => {
      const isSelected = f.skinTypes.includes(st);
      return {
        ...f,
        skinTypes: isSelected ? f.skinTypes.filter((s) => s !== st) : [...f.skinTypes, st],
      };
    });
  };

  const resetAll = () => {
    setFilters({
      search: "",
      categories: [],
      skinTypes: [],
      maxPrice: priceMax,
      inStockOnly: false,
      tier: "All",
    });
    setSelectedRitual("All");
  };

  const setSearch = (search: string) => setFilters((f) => ({ ...f, search }));
  const setMaxPrice = (maxPrice: number) => setFilters((f) => ({ ...f, maxPrice }));
  const setInStockOnly = (inStockOnly: boolean) => setFilters((f) => ({ ...f, inStockOnly }));
  const setTier = (tier: string) => setFilters((f) => ({ ...f, tier }));
  const clearCategories = () => setFilters((f) => ({ ...f, categories: [] }));

  return {
    filters,
    setFilters,
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
  };
}

export default FilterSidebar;
