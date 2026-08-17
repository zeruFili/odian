import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatPrice, products, type Product } from '../data/products'
import { useCart } from '../store/cart'
import ProductImage from './ProductImage'
import ProductCard from './ProductCard'
import Footer from './Footer'
import { StarIcon } from './Icons'

const REVIEW_NAMES = ['Ava', 'Maya', 'Sofia', 'Elena', 'Chloe']
const REVIEW_DATES = ['October 12, 2025', 'November 5, 2025', 'December 3, 2025', 'January 18, 2026', 'February 2, 2026']
const REVIEW_BODIES = [
  'My skin reacts to almost everything, but this product has been so calming. No redness, no itching, just healthy skin.',
  'The texture is so luxurious and it absorbs instantly. I noticed a real difference within two weeks.',
  'This has quickly become a staple in my routine. Gentle, effective, and it smells incredible.',
  'A little goes a long way. My skin feels plump and hydrated all day long.',
  'Worth every penny. The results speak for themselves — my complexion has never looked better.',
]

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const product = useMemo(() => products.find((p) => p.id === id), [id])

  useEffect(() => {
    setQuantity(1)
    setAdded(false)
  }, [id])

  if (!product) {
    return (
      <>
        <div className="container pd-notfound">
          <h1>Product not found</h1>
          <p>The product you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="btn">Back to shop</Link>
        </div>
        <Footer />
      </>
    )
  }

  const related = getRelatedProducts(product)

  const isOutOfStock = product.type === 'outofstock'
  const isVariable = product.type === 'variable'
  const isGrouped = product.type === 'grouped'
  const isExternal = product.type === 'external'
  const isInCartable = product.type === 'simple'

  const addLabel =
    isOutOfStock ? 'Read more' :
    isVariable ? 'Select options' :
    isGrouped ? 'View products' :
    isExternal ? 'Buy on Lumière Store' :
    'Add to cart'

  const handleAdd = () => {
    if (!isInCartable) return
    addToCart(product.id, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <>
      <div className="container pd">
        {/* Breadcrumb */}
        <nav className="breadcrumb pd__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb__sep">/</span>
          <Link to="/">Shop</Link>
          <span className="breadcrumb__sep">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className="pd__grid">
          {/* Gallery */}
          <div className="pd__gallery">
            <div className="pd__main-image">
              <ProductImage product={product} />
            </div>
            <div className="pd__thumbs">
              {[0, 1, 2].map((i) => (
                <div className="pd__thumb" key={i}>
                  <ProductImage product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pd__info">
            <h1 className="pd__title">{product.name}</h1>

            <div className="pd__price">
              {isVariable || isGrouped ? (
                <span className="price">{formatPrice(product, product.price)} – {formatPrice(product, product.priceMax ?? product.price)}</span>
              ) : product.compareAtPrice ? (
                <>
                  <span className="price">{formatPrice(product, product.price)}</span>
                  <del className="price price--old">{formatPrice(product, product.compareAtPrice)}</del>
                </>
              ) : (
                <span className="price">{formatPrice(product, product.price)}</span>
              )}
            </div>

            <div className="pd__rating">
              <span className="stars" aria-label={`Rated ${product.rating} out of 5`}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon key={i} size={16} className={i <= Math.round(product.rating) ? 'star star--on' : 'star'} />
                ))}
              </span>
              <span>Rated <strong>{product.rating.toFixed(2)}</strong> out of 5 based on {product.reviews} customer rating</span>
              <a href="#reviews" className="pd__rating-link">({product.reviews} customer review)</a>
            </div>

            <p className="pd__description">{product.description}</p>

            <div className="pd__actions">
              <div className="pd__qty">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">+</button>
              </div>
              <button
                className={`btn pd__add ${added ? 'is-added' : ''}`}
                onClick={handleAdd}
                disabled={!isInCartable}
              >
                {added ? 'Added ✓' : addLabel}
              </button>
            </div>

            <div className="pd__meta">
              {(product.brand || product.location) && (
                <div className="pd__tags">
                  {product.brand && <span className="pd__meta-label">Brand:</span>}
                  {product.brand && <span>{product.brand}</span>}
                  {product.location && <span className="pd__meta-sep">·</span>}
                  {product.location && <span>{product.location}</span>}
                </div>
              )}
              <div className="pd__tags">
                <span className="pd__meta-label">Tags:</span>
                <a href="#">Beauty</a>
                <a href="#">Health</a>
              </div>
              <div className="pd__cats">
                <span className="pd__meta-label">Categories:</span>
                {product.categories.map((c) => (
                  <Link key={c} to="/">{c}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pd__tabs">
          <div className="pd__tabbar">
            <button className="pd__tab is-active" type="button">Description</button>
            <button className="pd__tab" type="button">Reviews ({product.reviews})</button>
          </div>
          <div className="pd__tab-panel">
            <p>
              Specially selected products provide comprehensive body and face care, making this gift desirable and enjoyable for any occasion.
              Each formula is crafted with clean, high-performance ingredients that are gentle on the skin and kind to the planet.
            </p>
          </div>
        </div>

        {/* Reviews */}
        <section className="pd__reviews" id="reviews">
          <h2 className="pd__reviews-title">{product.reviews} review for {product.name}</h2>
          <ol className="pd__review-list">
            {Array.from({ length: product.reviews }, (_, i) => (
              <li className="pd__review" key={i}>
                <div className="pd__review-avatar">{REVIEW_NAMES[i % REVIEW_NAMES.length][0]}</div>
                <div className="pd__review-body">
                  <span className="stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon key={s} size={14} className={s <= Math.round(product.rating) ? 'star star--on' : 'star'} />
                    ))}
                  </span>
                  <p className="pd__review-author">
                    <strong>{REVIEW_NAMES[i % REVIEW_NAMES.length]}</strong> – {REVIEW_DATES[i % REVIEW_DATES.length]}
                  </p>
                  <p className="pd__review-text">{REVIEW_BODIES[i % REVIEW_BODIES.length]}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Related products */}
      <section className="related">
        <div className="container">
          <h2 className="related__title">You may also like</h2>
          <ul className="related__grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </>
  )
}

function getRelatedProducts(product: Product): Product[] {
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c)),
  )
  const others = products.filter(
    (p) => p.id !== product.id && !p.categories.some((c) => product.categories.includes(c)),
  )
  return [...sameCategory, ...others].slice(0, 4)
}
