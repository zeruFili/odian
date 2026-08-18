import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../store/cart'
import { useMobileFilters } from '../store/filters'
import { CATEGORY_TICKER, CATEGORIES, SKIN_TYPES, products, priceInUsd } from '../data/products'
import ProductCard from './ProductCard'
import Footer from './Footer'
import { CloseIcon, SparkleIcon } from './Icons'

interface ShopFilters {
  categories: string[]
  skinTypes: string[]
  maxPrice: number
  inStockOnly: boolean
}

type SortKey = 'default' | 'popularity' | 'rating' | 'latest' | 'price-asc' | 'price-desc'

const PAGE_SIZE = 9
const PRICE_MAX = 200

const DEFAULT_FILTERS: ShopFilters = {
  categories: [],
  skinTypes: [],
  maxPrice: PRICE_MAX,
  inStockOnly: false,
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Average rating' },
  { value: 'latest', label: 'Latest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

export default function ShopPage() {
  const [filters, setFilters] = useState<ShopFilters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortKey>('default')
  const [page, setPage] = useState(1)
  const { isOpen: mobileFilters, open: openMobileFilters, close: closeMobileFilters } = useMobileFilters()
  const { addToCart } = useCart()

  const visible = products.filter((p) => {
    if (filters.categories.length && !p.categories.some((c) => filters.categories.includes(c))) return false
    if (filters.skinTypes.length && !p.skinTypes.some((s) => filters.skinTypes.includes(s))) return false
    if (priceInUsd(p) > filters.maxPrice) return false
    if (filters.inStockOnly && p.type === 'outofstock') return false
    return true
  })

  const sorted = [...visible].sort((a, b) => {
    switch (sort) {
      case 'popularity':
        return b.reviews - a.reviews
      case 'rating':
        return b.rating - a.rating
      case 'latest':
        return b.id.localeCompare(a.id)
      case 'price-asc':
        return priceInUsd(a) - priceInUsd(b)
      case 'price-desc':
        return priceInUsd(b) - priceInUsd(a)
      default:
        return 0
    }
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function toggleFilter(kind: 'categories' | 'skinTypes', value: string) {
    setPage(1)
    setFilters((f) => {
      const list = f[kind]
      return {
        ...f,
        [kind]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      }
    })
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const activeCount = filters.categories.length + filters.skinTypes.length + (filters.maxPrice < PRICE_MAX ? 1 : 0) + (filters.inStockOnly ? 1 : 0)

  return (
    <>
      {/* Hero */}
      <section className="shop-hero">
        <div className="container shop-hero__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb__sep">/</span>
            <span aria-current="page">Shop</span>
          </nav>
          <h1 className="shop-hero__title">Shop</h1>
          <p className="shop-hero__subtitle">
            Discover the combination of science and luxury in every product. New collection is give skin radiance.
          </p>
        </div>
        <div className="shop-hero__img" aria-hidden="true">
          <HeroIllustration />
        </div>
      </section>

      {/* Category ticker */}
      <div className="ticker-wrap">
        <div className="ticker">
          {[...CATEGORY_TICKER, ...CATEGORY_TICKER].map((cat, i) => (
            <span className="ticker__item" key={`${cat}-${i}`}>
              <SparkleIcon size={14} />
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Catalog */}
      <section className="catalog container">
        <aside className={`filters ${mobileFilters ? 'is-open' : ''}`} aria-label="Filters">
          <div className="filters__header">
            <h2 className="filters__title">Filters</h2>
            <button className="icon-btn filters__close" onClick={closeMobileFilters} aria-label="Close filters">
              <CloseIcon />
            </button>
          </div>

          <FilterGroup title="Category">
            {CATEGORIES.slice(0, 11).map((c) => (
              <Checkbox
                key={c}
                label={c}
                checked={filters.categories.includes(c)}
                onChange={() => toggleFilter('categories', c)}
              />
            ))}
            <button className="show-more" type="button">Show {CATEGORIES.length - 11} more</button>
          </FilterGroup>

          <FilterGroup title="Price">
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
                aria-label="Maximum price"
              />
              <div className="price-range__labels">
                <span>$10</span>
                <span>${filters.maxPrice}</span>
              </div>
            </div>
          </FilterGroup>

          <FilterGroup title="Skin type">
            {SKIN_TYPES.map((s) => (
              <Checkbox
                key={s}
                label={s}
                checked={filters.skinTypes.includes(s)}
                onChange={() => toggleFilter('skinTypes', s)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Availability">
            <Checkbox
              label="In stock"
              checked={filters.inStockOnly}
              onChange={() => {
                setPage(1)
                setFilters((f) => ({ ...f, inStockOnly: !f.inStockOnly }))
              }}
            />
            <Checkbox
              label="Out of stock"
              checked={false}
              onChange={() => {}}
              disabled
            />
          </FilterGroup>

          <button className="btn btn--block filters__apply" onClick={closeMobileFilters}>
            Apply
          </button>
          {activeCount > 0 && (
            <button className="filters__reset" onClick={resetFilters} type="button">
              Clear all ({activeCount})
            </button>
          )}
        </aside>

        {mobileFilters && <div className="filters__overlay" onClick={closeMobileFilters} />}

        <div className="catalog__main">
          <div className="catalog__toolbar">
            <button className="filter-toggle" onClick={openMobileFilters} type="button">
              Filter products
            </button>
            <div className="catalog__results">Showing {paged.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length} results</div>
            <label className="sort">
              <span>Sort by</span>
              <select value={sort} onChange={(e) => { setSort(e.target.value as SortKey); setPage(1) }}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
          </div>

          {sorted.length === 0 ? (
            <div className="empty">
              <h3>No products found</h3>
              <p>Try adjusting your filters to find what you're looking for.</p>
              <button className="btn" onClick={resetFilters}>Clear filters</button>
            </div>
          ) : (
            <ul className="grid">
              {paged.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button
                className="pagination__btn"
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`pagination__num ${n === safePage ? 'is-current' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className="pagination__btn"
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                →
              </button>
            </nav>
          )}
        </div>
      </section>

      {/* Promo banner */}
      <section className="promo">
        <div className="container promo__inner">
          <div className="promo__content">
            <span className="promo__eyebrow">Discounts</span>
            <h2 className="promo__title">30% discount on anti-aging care until the end of the month</h2>
            <Link to="/discount" className="btn">Shop discounts</Link>
          </div>
          <div className="promo__art" aria-hidden="true">
            <PromoIllustration />
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

function Checkbox({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <label className={`checkbox ${disabled ? 'is-disabled' : ''}`}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
      <span className="checkbox__box">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17 19 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <span className="checkbox__label">{label}</span>
    </label>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="filter-group">
      <h3 className="filter-group__title">{title}</h3>
      <div className="filter-group__body">{children}</div>
    </div>
  )
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" className="hero-art">
      <defs>
        <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fdf2f8" />
          <stop offset="100%" stopColor="#fae9ea" />
        </linearGradient>
        <linearGradient id="hero-jar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6e7d8" />
          <stop offset="100%" stopColor="#e8c9a6" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#hero-bg)" />
      <circle cx="200" cy="150" r="120" fill="#ffffff55" />
      <ellipse cx="200" cy="252" rx="90" ry="14" fill="#00000010" />
      <path d="M128 168 q0 -52 72 -52 q72 0 72 52 v66 q0 30 -72 30 q-72 0 -72 -30 z" fill="url(#hero-jar)" />
      <path d="M128 168 q0 -52 72 -52 q72 0 72 52 q0 30 -72 30 q-72 0 -72 -30 z" fill="#ffffff33" />
      <rect x="146" y="176" width="108" height="52" rx="6" fill="#ffffff" opacity="0.94" />
      <rect x="154" y="185" width="92" height="6" rx="3" fill="#c98a5f" />
      <rect x="154" y="197" width="72" height="4.5" rx="2.25" fill="#b3a596" />
      <rect x="154" y="207" width="60" height="4.5" rx="2.25" fill="#b3a596" />
      <rect x="128" y="98" width="144" height="70" rx="10" fill="#d9a86b" />
      <rect x="128" y="98" width="144" height="16" rx="8" fill="#ffffff40" />
      <g stroke="#0c0a09" strokeWidth="2" strokeLinecap="round" opacity="0.5">
        <path d="M84 150 C 60 130, 70 100, 100 90" fill="none" />
        <path d="M316 150 C 340 130, 330 100, 300 90" fill="none" />
      </g>
    </svg>
  )
}

function PromoIllustration() {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" className="promo-art-svg">
      <defs>
        <linearGradient id="promo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#efe3f0" />
          <stop offset="100%" stopColor="#dcc6df" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#promo-bg)" />
      <circle cx="330" cy="70" r="46" fill="#ffffff44" />
      <circle cx="70" cy="230" r="60" fill="#ffffff33" />
      <ellipse cx="200" cy="252" rx="80" ry="13" fill="#00000010" />
      <path d="M136 150 q0 -40 64 -40 q64 0 64 40 v84 q0 24 -64 24 q-64 0 -64 -24 z" fill="#f3e7ef" />
      <path d="M136 150 q0 -40 64 -40 q64 0 64 40 q0 24 -64 24 q-64 0 -64 -24 z" fill="#ffffff40" />
      <rect x="150" y="158" width="100" height="48" rx="6" fill="#ffffff" opacity="0.94" />
      <rect x="158" y="166" width="84" height="5.5" rx="2.75" fill="#b793bc" />
      <rect x="158" y="178" width="66" height="4" rx="2" fill="#a079a6" />
      <rect x="158" y="188" width="54" height="4" rx="2" fill="#a079a6" />
      <rect x="136" y="88" width="128" height="62" rx="9" fill="#c9a8cd" />
      <rect x="136" y="88" width="128" height="14" rx="7" fill="#ffffff45" />
      <g stroke="#0c0a09" strokeWidth="2" strokeLinecap="round" opacity="0.4">
        <path d="M100 130 C 78 112, 88 86, 114 78" fill="none" />
        <path d="M300 130 C 322 112, 312 86, 286 78" fill="none" />
      </g>
    </svg>
  )
}
