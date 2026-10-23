import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../store/cart'
import { priceInUsd, type Product } from '../data/products'
import ProductCard from './ProductCard'
import QuickViewModal from './QuickViewModal'
import Footer from './Footer'
import { GridViewIcon, ListViewIcon, SparkleIcon } from './Icons'

type SortKey = 'default' | 'popularity' | 'rating' | 'latest' | 'price-asc' | 'price-desc'

const PAGE_SIZE = 12

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Average rating' },
  { value: 'latest', label: 'Latest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

interface CollectionProps {
  title: string
  subtitle: string
  crumb: string
  items: Product[]
  accent?: string
  heroBadge?: string
}

export default function CollectionPage({
  title,
  subtitle,
  crumb,
  items,
  accent,
  heroBadge = 'Curated Collection',
}: CollectionProps) {
  const [sort, setSort] = useState<SortKey>('default')
  const [page, setPage] = useState(1)
  const [isListView, setIsListView] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const { addToCart } = useCart()

  const sorted = [...items].sort((a, b) => {
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

  return (
    <>
      <section className="shop-hero collection-hero" style={accent ? { background: accent } : undefined}>
        <div className="container shop-hero__inner">
          <div className="collection-hero-content">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumb__sep">/</span>
              <span aria-current="page">{crumb}</span>
            </nav>
            <span className="collection-badge">
              <SparkleIcon size={14} /> {heroBadge}
            </span>
            <h1 className="shop-hero__title">{title}</h1>
            <p className="shop-hero__subtitle">{subtitle}</p>
          </div>
        </div>
      </section>

      <section className="catalog container collection-catalog">
        <div className="catalog__main">
          <div className="catalog__toolbar">
            <div className="toolbar-left">
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
              {/* View Switcher */}
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
                <span>Sort by:</span>
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

          {sorted.length === 0 ? (
            <div className="empty">
              <h3>No Formulations Found</h3>
              <p>Explore our complete catalog for alternative skincare options.</p>
              <Link to="/" className="btn btn--primary">
                Shop All Formulations
              </Link>
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

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button
                className="pagination__btn"
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                ← Prev
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
                Next →
              </button>
            </nav>
          )}
        </div>
      </section>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <Footer />
    </>
  )
}
