import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../store/cart'
import { priceInUsd, type Product } from '../data/products'
import ProductCard from './ProductCard'
import Footer from './Footer'

type SortKey = 'default' | 'popularity' | 'rating' | 'latest' | 'price-asc' | 'price-desc'

const PAGE_SIZE = 9

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
  /** Optional hero accent color (CSS variable). */
  accent?: string
}

export default function CollectionPage({ title, subtitle, crumb, items, accent }: CollectionProps) {
  const [sort, setSort] = useState<SortKey>('default')
  const [page, setPage] = useState(1)
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
      <section className="shop-hero" style={accent ? { background: accent } : undefined}>
        <div className="container shop-hero__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb__sep">/</span>
            <span aria-current="page">{crumb}</span>
          </nav>
          <h1 className="shop-hero__title">{title}</h1>
          <p className="shop-hero__subtitle">{subtitle}</p>
        </div>
      </section>

      <section className="catalog container" style={{ gridTemplateColumns: '1fr' }}>
        <div className="catalog__main">
          <div className="catalog__toolbar">
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
              <p>Try browsing the full shop for more options.</p>
              <Link to="/" className="btn">Shop all products</Link>
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

      <Footer />
    </>
  )
}
