import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../store/cart'
import { useMobileFilters } from '../store/filters'
import {
  CATEGORY_TICKER,
  CATEGORIES,
  SKIN_TYPES,
  products,
  priceInUsd,
  type Product,
} from '../data/products'
import ProductCard from './ProductCard'
import QuickViewModal from './QuickViewModal'
import Footer from './Footer'
import {
  CloseIcon,
  FilterIcon,
  GridViewIcon,
  ListViewIcon,
  SparkleIcon,
  ShieldCheckIcon,
  TruckIcon,
  LeafIcon,
  RefreshCwIcon,
} from './Icons'

interface ShopFilters {
  search: string
  categories: string[]
  skinTypes: string[]
  brands: string[]
  maxPrice: number
  inStockOnly: boolean
}

type SortKey = 'default' | 'popularity' | 'rating' | 'latest' | 'price-asc' | 'price-desc'

const PAGE_SIZE = 12
const PRICE_MAX = 200

const DEFAULT_FILTERS: ShopFilters = {
  search: '',
  categories: [],
  skinTypes: [],
  brands: [],
  maxPrice: PRICE_MAX,
  inStockOnly: false,
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'Featured & Popular' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'latest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

const QUICK_CATEGORIES = [
  { name: 'All Products', query: '' },
  { name: 'Serums', query: 'Serums' },
  { name: 'Cleansers', query: 'Cleansers' },
  { name: 'Moisturizers', query: 'Moisturizers' },
  { name: 'Treatments', query: 'Treatments' },
  { name: 'Toners', query: 'Toners' },
  { name: 'Eye Care', query: 'Eye Care' },
  { name: 'Masks', query: 'Masks' },
  { name: 'Body Care', query: 'Body Care' },
  { name: 'Hair Care', query: 'Hair Care' },
]

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<ShopFilters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortKey>('default')
  const [page, setPage] = useState(1)
  const [isListView, setIsListView] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const { isOpen: mobileFilters, open: openMobileFilters, close: closeMobileFilters } = useMobileFilters()
  const { addToCart } = useCart()

  // Read URL params (e.g. ?category=Serums)
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) {
      setFilters((f) => ({ ...f, categories: [cat] }))
      setPage(1)
    }
  }, [searchParams])

  // Get unique brands
  const allBrands = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.brand && p.brand !== 'Unbranded') set.add(p.brand)
    })
    return Array.from(set).sort()
  }, [])

  // Filtered products
  const visible = useMemo(() => {
    return products.filter((p) => {
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase()
        const matchesName = p.name.toLowerCase().includes(q)
        const matchesCat = p.category.toLowerCase().includes(q)
        const matchesBrand = p.brand ? p.brand.toLowerCase().includes(q) : false
        if (!matchesName && !matchesCat && !matchesBrand) return false
      }
      if (filters.categories.length && !p.categories.some((c) => filters.categories.includes(c))) {
        return false
      }
      if (filters.skinTypes.length && !p.skinTypes.some((s) => filters.skinTypes.includes(s))) {
        return false
      }
      if (filters.brands.length && (!p.brand || !filters.brands.includes(p.brand))) {
        return false
      }
      if (priceInUsd(p) > filters.maxPrice) return false
      if (filters.inStockOnly && p.type === 'outofstock') return false
      return true
    })
  }, [filters])

  // Sorted products
  const sorted = useMemo(() => {
    return [...visible].sort((a, b) => {
      switch (sort) {
        case 'popularity':
          return b.reviews - a.reviews
        case 'rating':
          return b.rating - a.rating
        case 'latest':
          return b.badge === 'new' ? -1 : 1
        case 'price-asc':
          return priceInUsd(a) - priceInUsd(b)
        case 'price-desc':
          return priceInUsd(b) - priceInUsd(a)
        default:
          return 0
      }
    })
  }, [visible, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function toggleFilter(kind: 'categories' | 'skinTypes' | 'brands', value: string) {
    setPage(1)
    setFilters((f) => {
      const list = f[kind]
      const updated = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
      return { ...f, [kind]: updated }
    })
  }

  function handleQuickCategory(catQuery: string) {
    setPage(1)
    if (!catQuery) {
      setFilters((f) => ({ ...f, categories: [] }))
      setSearchParams({})
    } else {
      setFilters((f) => ({ ...f, categories: [catQuery] }))
      setSearchParams({ category: catQuery })
    }
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
    setSearchParams({})
    setPage(1)
  }

  const activeCount =
    filters.categories.length +
    filters.skinTypes.length +
    filters.brands.length +
    (filters.maxPrice < PRICE_MAX ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.search.trim().length > 0 ? 1 : 0)

  // Countdown timer for promo section
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 18 })
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {/* Editorial Luxury Hero */}
      <section className="shop-hero">
        <div className="container shop-hero__inner">
          <div className="shop-hero__content">
            <span className="hero-eyebrow">
              <SparkleIcon size={14} /> The Science of Pure Radiance
            </span>
            <h1 className="shop-hero__title">
              Botanical Potency. <br />
              <em>Clinical Perfection.</em>
            </h1>
            <p className="shop-hero__subtitle">
              Discover clean, medical-grade formulations that unite bio-fermented actives with pure
              botanical essences. Formulated without compromise to reveal your healthiest, most
              vibrant skin.
            </p>

            <div className="hero-actions">
              <a href="#catalog" className="btn btn--primary">
                Explore Formulations
              </a>
              <Link to="/discount" className="btn btn--ghost">
                View Limited Offers (-30%)
              </Link>
            </div>

            <div className="hero-proof-points">
              <div className="proof-item">
                <span className="proof-icon">✓</span>
                <span>Dermatologist Tested</span>
              </div>
              <div className="proof-item">
                <span className="proof-icon">✓</span>
                <span>100% Vegan & Cruelty-Free</span>
              </div>
              <div className="proof-item">
                <span className="proof-icon">✓</span>
                <span>Bio-Compatible Delivery</span>
              </div>
            </div>
          </div>

          <div className="shop-hero__image-showcase" aria-hidden="true">
            <div className="hero-card-featured">
              <img
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85"
                alt="Radiance Renewal Serum"
                className="hero-main-photo"
              />
              <div className="hero-floating-pill">
                <SparkleIcon size={16} />
                <div>
                  <strong>Radiance Renewal Serum</strong>
                  <span>Award Winner 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section className="value-pillars">
        <div className="container value-pillars__inner">
          <div className="pillar-item">
            <LeafIcon size={24} />
            <div className="pillar-text">
              <h4>Clean Ingredients</h4>
              <p>Zero parabens, sulfates, synthetic fragrances or toxins.</p>
            </div>
          </div>
          <div className="pillar-item">
            <ShieldCheckIcon size={24} />
            <div className="pillar-text">
              <h4>Dermatological Efficacy</h4>
              <p>Clinically measured active concentrations for real results.</p>
            </div>
          </div>
          <div className="pillar-item">
            <TruckIcon size={24} />
            <div className="pillar-text">
              <h4>Free Express Delivery</h4>
              <p>Complimentary tracked delivery on all orders over $50.</p>
            </div>
          </div>
          <div className="pillar-item">
            <RefreshCwIcon size={24} />
            <div className="pillar-text">
              <h4>30-Day Guarantee</h4>
              <p>Love your skin’s transformation or receive a full refund.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Ticker */}
      <div className="ticker-wrap" aria-hidden="true">
        <div className="ticker">
          {[...CATEGORY_TICKER, ...CATEGORY_TICKER, ...CATEGORY_TICKER].map((cat, i) => (
            <span className="ticker__item" key={`${cat}-${i}`}>
              <SparkleIcon size={13} />
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Category Filter Bar */}
      <section className="quick-category-bar">
        <div className="container quick-category-inner">
          <span className="quick-cat-title">Browse By Category:</span>
          <div className="quick-cat-scroll">
            {QUICK_CATEGORIES.map((qc) => {
              const isSelected =
                (!qc.query && filters.categories.length === 0) ||
                filters.categories.includes(qc.query)
              return (
                <button
                  key={qc.name}
                  className={`quick-cat-chip ${isSelected ? 'is-active' : ''}`}
                  onClick={() => handleQuickCategory(qc.query)}
                >
                  {qc.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="catalog container" id="catalog">
        {/* Filters Sidebar */}
        <aside className={`filters ${mobileFilters ? 'is-open' : ''}`} aria-label="Catalog Filters">
          <div className="filters__header">
            <h2 className="filters__title">Filters</h2>
            {activeCount > 0 && (
              <span className="filters__count-badge">{activeCount} active</span>
            )}
            <button
              className="icon-btn filters__close"
              onClick={closeMobileFilters}
              aria-label="Close filters drawer"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Search Filter */}
          <div className="filter-group">
            <h3 className="filter-group__title">Search Catalog</h3>
            <div className="filter-search-box">
              <input
                type="text"
                placeholder="Search products, brands…"
                value={filters.search}
                onChange={(e) => {
                  setPage(1)
                  setFilters((f) => ({ ...f, search: e.target.value }))
                }}
              />
              {filters.search && (
                <button
                  className="filter-search-clear"
                  onClick={() => setFilters((f) => ({ ...f, search: '' }))}
                >
                  <CloseIcon size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <FilterGroup title="Product Category">
            <div className="filter-list-scroll">
              {CATEGORIES.map((c) => {
                const countForCat = products.filter((p) => p.categories.includes(c)).length
                return (
                  <Checkbox
                    key={c}
                    label={c}
                    badgeCount={countForCat}
                    checked={filters.categories.includes(c)}
                    onChange={() => toggleFilter('categories', c)}
                  />
                )
              })}
            </div>
          </FilterGroup>

          {/* Price Range */}
          <FilterGroup title="Maximum Price">
            <div className="price-range">
              <input
                type="range"
                min={10}
                max={PRICE_MAX}
                step={5}
                value={filters.maxPrice}
                onChange={(e) => {
                  setPage(1)
                  setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))
                }}
                aria-label="Maximum price in USD"
              />
              <div className="price-range__labels">
                <span>$10</span>
                <span className="price-range__current">${filters.maxPrice}</span>
                <span>${PRICE_MAX}</span>
              </div>
            </div>
          </FilterGroup>

          {/* Skin Type */}
          <FilterGroup title="Skin Profile">
            {SKIN_TYPES.map((s) => (
              <Checkbox
                key={s}
                label={`${s} skin`}
                checked={filters.skinTypes.includes(s)}
                onChange={() => toggleFilter('skinTypes', s)}
              />
            ))}
          </FilterGroup>

          {/* Brands Filter */}
          {allBrands.length > 0 && (
            <FilterGroup title="Verified Brands">
              <div className="filter-list-scroll">
                {allBrands.map((b) => (
                  <Checkbox
                    key={b}
                    label={b}
                    checked={filters.brands.includes(b)}
                    onChange={() => toggleFilter('brands', b)}
                  />
                ))}
              </div>
            </FilterGroup>
          )}

          {/* Availability */}
          <FilterGroup title="Availability">
            <Checkbox
              label="In Stock Only"
              checked={filters.inStockOnly}
              onChange={() => {
                setPage(1)
                setFilters((f) => ({ ...f, inStockOnly: !f.inStockOnly }))
              }}
            />
          </FilterGroup>

          <button className="btn btn--block btn--primary filters__apply" onClick={closeMobileFilters}>
            Apply Filters ({sorted.length} Products)
          </button>

          {activeCount > 0 && (
            <button className="filters__reset" onClick={resetFilters} type="button">
              Clear all filters ({activeCount})
            </button>
          )}
        </aside>

        {mobileFilters && <div className="filters__overlay" onClick={closeMobileFilters} />}

        {/* Main Products Grid Column */}
        <div className="catalog__main">
          {/* Toolbar */}
          <div className="catalog__toolbar">
            <div className="toolbar-left">
              <button className="filter-toggle" onClick={openMobileFilters} type="button">
                <FilterIcon size={16} />
                <span>Filters</span>
                {activeCount > 0 && <span className="filter-toggle__badge">{activeCount}</span>}
              </button>

              <div className="catalog__results">
                Showing{' '}
                <strong>
                  {paged.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
                  {Math.min(safePage * PAGE_SIZE, sorted.length)}
                </strong>{' '}
                of <strong>{sorted.length}</strong> products
              </div>
            </div>

            <div className="toolbar-right">
              {/* Grid vs List View Switcher */}
              <div className="view-switcher" role="group" aria-label="Layout view">
                <button
                  className={`view-btn ${!isListView ? 'is-active' : ''}`}
                  onClick={() => setIsListView(false)}
                  aria-label="Grid layout view"
                  type="button"
                >
                  <GridViewIcon size={17} />
                </button>
                <button
                  className={`view-btn ${isListView ? 'is-active' : ''}`}
                  onClick={() => setIsListView(true)}
                  aria-label="List layout view"
                  type="button"
                >
                  <ListViewIcon size={17} />
                </button>
              </div>

              {/* Sort By Dropdown */}
              <label className="sort">
                <span>Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortKey)
                    setPage(1)
                  }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Active Filter Tags Bar */}
          {activeCount > 0 && (
            <div className="active-filters-bar">
              <span className="active-filters-label">Active:</span>
              {filters.search && (
                <button
                  className="filter-tag"
                  onClick={() => setFilters((f) => ({ ...f, search: '' }))}
                >
                  "{filters.search}" ✕
                </button>
              )}
              {filters.categories.map((c) => (
                <button
                  key={c}
                  className="filter-tag"
                  onClick={() => toggleFilter('categories', c)}
                >
                  {c} ✕
                </button>
              ))}
              {filters.skinTypes.map((s) => (
                <button
                  key={s}
                  className="filter-tag"
                  onClick={() => toggleFilter('skinTypes', s)}
                >
                  {s} Skin ✕
                </button>
              ))}
              {filters.brands.map((b) => (
                <button
                  key={b}
                  className="filter-tag"
                  onClick={() => toggleFilter('brands', b)}
                >
                  Brand: {b} ✕
                </button>
              ))}
              {filters.maxPrice < PRICE_MAX && (
                <button
                  className="filter-tag"
                  onClick={() => setFilters((f) => ({ ...f, maxPrice: PRICE_MAX }))}
                >
                  ≤ ${filters.maxPrice} ✕
                </button>
              )}
              {filters.inStockOnly && (
                <button
                  className="filter-tag"
                  onClick={() => setFilters((f) => ({ ...f, inStockOnly: false }))}
                >
                  In Stock ✕
                </button>
              )}
              <button className="filter-clear-all" onClick={resetFilters}>
                Clear All
              </button>
            </div>
          )}

          {/* Products List or Empty State */}
          {sorted.length === 0 ? (
            <div className="empty">
              <div className="empty__icon" aria-hidden="true">
                <FilterIcon size={44} strokeWidth={1.2} />
              </div>
              <h3 className="empty__title">No Formulations Match Your Criteria</h3>
              <p className="empty__text">
                Try widening your price range, clearing selected filters, or searching for a different
                skincare benefit.
              </p>
              <button className="btn btn--primary" onClick={resetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <ul className={`grid ${isListView ? 'grid--list' : ''}`}>
              {paged.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                  onQuickView={setQuickViewProduct}
                  listView={isListView}
                />
              ))}
            </ul>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Catalog pages">
              <button
                className="pagination__btn"
                disabled={safePage === 1}
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1))
                  window.scrollTo({ top: 400, behavior: 'smooth' })
                }}
                aria-label="Previous page"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`pagination__num ${n === safePage ? 'is-current' : ''}`}
                  onClick={() => {
                    setPage(n)
                    window.scrollTo({ top: 400, behavior: 'smooth' })
                  }}
                  aria-current={n === safePage ? 'page' : undefined}
                >
                  {n}
                </button>
              ))}
              <button
                className="pagination__btn"
                disabled={safePage === totalPages}
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1))
                  window.scrollTo({ top: 400, behavior: 'smooth' })
                }}
                aria-label="Next page"
              >
                Next →
              </button>
            </nav>
          )}
        </div>
      </section>

      {/* Promotional Banner with Live Timer */}
      <section className="promo">
        <div className="container promo__inner">
          <div className="promo__content">
            <span className="promo__eyebrow">Seasonal Formulation Event</span>
            <h2 className="promo__title">
              30% Discount on Regenerative Anti-Aging Formulations
            </h2>
            <p className="promo__desc">
              Harness encapsulated retinol and bio-cellular peptide complexes. Clinically proven
              to restore skin elasticity and cellular renewal overnight.
            </p>

            {/* Countdown timer */}
            <div className="promo-timer">
              <span className="promo-timer-label">Offer expires in:</span>
              <div className="timer-blocks">
                <div className="timer-box">
                  <span className="timer-val">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="timer-unit">Hours</span>
                </div>
                <span className="timer-colon">:</span>
                <div className="timer-box">
                  <span className="timer-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="timer-unit">Mins</span>
                </div>
                <span className="timer-colon">:</span>
                <div className="timer-box">
                  <span className="timer-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="timer-unit">Secs</span>
                </div>
              </div>
            </div>

            <Link to="/discount" className="btn btn--primary promo__btn">
              Shop Discounted Collection →
            </Link>
          </div>

          <div className="promo__visual" aria-hidden="true">
            <div className="promo-photo-frame">
              <img
                src="https://images.unsplash.com/photo-1556228722-d0b5d0f81f44?auto=format&fit=crop&w=800&q=80"
                alt="Retinol Night Treatment"
                className="promo-photo"
              />
              <div className="promo-discount-badge">-30% OFF</div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Press / Social Proof */}
      <section className="press-section">
        <div className="container press-inner">
          <span className="press-label">As Featured & Endorsed In</span>
          <div className="press-logos">
            <span className="press-name">VOGUE</span>
            <span className="press-name">ELLE</span>
            <span className="press-name">HARPER'S BAZAAR</span>
            <span className="press-name">ALLURE</span>
            <span className="press-name">MARIE CLAIRE</span>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <Footer />
    </>
  )
}

function Checkbox({
  label,
  checked,
  onChange,
  disabled,
  badgeCount,
}: {
  label: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
  badgeCount?: number
}) {
  return (
    <label className={`checkbox ${disabled ? 'is-disabled' : ''}`}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
      <span className="checkbox__box">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 12.5 10 17 19 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="checkbox__label">{label}</span>
      {badgeCount != null && <span className="checkbox__count">({badgeCount})</span>}
    </label>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="filter-group">
      <button
        type="button"
        className="filter-group__header-btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <h3 className="filter-group__title">{title}</h3>
        <span className="filter-group__toggle-icon">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="filter-group__body">{children}</div>}
    </div>
  )
}
