import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { useCurrency } from '../store/currency'
import { useCart } from '../store/cart'
import { useWishlist } from '../store/wishlist'
import { useToast } from '../store/toast'
import ProductImage from './ProductImage'
import { CloseIcon, HeartIcon, StarIcon, CheckIcon } from './Icons'

interface Props {
  product: Product | null
  onClose: () => void
}

export default function QuickViewModal({ product, onClose }: Props) {
  const { format } = useCurrency()
  const { addToCart, openCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { showToast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setQuantity(1)
    setActiveImage(0)
    setAdded(false)
  }, [product?.id])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (product) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [product, onClose])

  if (!product) return null

  const gallery = Array.from(
    new Set([product.image, ...(product.images ?? [])].filter((img): img is string => Boolean(img))),
  )

  const isOutOfStock = product.type === 'outofstock'
  const isWish = isWishlisted(product.id)

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addToCart(product.id, quantity)
    setAdded(true)
    showToast({
      title: 'Added to Bag',
      message: `${quantity} × ${product.name}`,
      image: product.image,
      actionLabel: 'View Bag',
      onAction: openCart,
    })
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div className="quickview-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close" onClick={onClose} aria-label="Close modal">
          <CloseIcon size={20} />
        </button>

        <div className="quickview-grid">
          {/* Gallery */}
          <div className="quickview-media">
            <div className="quickview-main-image">
              <ProductImage product={product} src={gallery[activeImage]} />
              {product.badge && (
                <span className={`card__badge card__badge--${product.badge}`}>
                  {product.badge === 'sale' && product.compareAtPrice
                    ? `Save ${Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%`
                    : product.badge === 'bestseller'
                    ? 'Bestseller'
                    : 'New Arrival'}
                </span>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="quickview-thumbs">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    className={`quickview-thumb ${i === activeImage ? 'is-active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <ProductImage product={product} src={img} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="quickview-info">
            <div className="quickview-meta-top">
              <span className="quickview-cat">{product.category}</span>
              {product.brand && <span className="quickview-brand">· {product.brand}</span>}
            </div>

            <h2 className="quickview-title">
              <Link to={`/product/${product.id}`} onClick={onClose}>
                {product.name}
              </Link>
            </h2>

            <div className="quickview-rating">
              <span className="stars" aria-label={`Rated ${product.rating} out of 5`}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon
                    key={i}
                    size={14}
                    className={i <= Math.round(product.rating) ? 'star star--on' : 'star'}
                  />
                ))}
              </span>
              <span className="quickview-rating-num">{product.rating.toFixed(1)}</span>
              <span className="quickview-rating-count">({product.reviews} customer reviews)</span>
            </div>

            <div className="quickview-price-wrap">
              {product.compareAtPrice ? (
                <>
                  <span className="price price--current">{format(product, product.price)}</span>
                  <del className="price price--old">{format(product, product.compareAtPrice)}</del>
                  <span className="price-save-badge">
                    Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                  </span>
                </>
              ) : product.type === 'variable' || product.type === 'grouped' ? (
                <span className="price">
                  {format(product, product.price)} – {format(product, product.priceMax ?? product.price)}
                </span>
              ) : (
                <span className="price">{format(product, product.price)}</span>
              )}
            </div>

            <p className="quickview-desc">{product.description}</p>

            <div className="quickview-tags">
              <span className="quickview-tag-label">Suitable for:</span>
              {product.skinTypes.map((st) => (
                <span key={st} className="skin-pill">
                  {st}
                </span>
              ))}
            </div>

            <div className="quickview-stock-indicator">
              {isOutOfStock ? (
                <span className="stock-badge stock-badge--out">Currently Out of Stock</span>
              ) : (
                <span className="stock-badge stock-badge--in">✓ In Stock & Ready to Ship</span>
              )}
            </div>

            <div className="quickview-actions">
              {!isOutOfStock && (
                <div className="qty-stepper">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
                    +
                  </button>
                </div>
              )}

              <button
                className={`btn btn--primary quickview-add-btn ${added ? 'is-added' : ''}`}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {added ? (
                  <>
                    <CheckIcon size={16} /> Added to Bag
                  </>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  'Add to Shopping Bag'
                )}
              </button>

              <button
                className={`quickview-wishlist-btn ${isWish ? 'is-active' : ''}`}
                onClick={() => {
                  toggleWishlist(product.id)
                  showToast({
                    title: isWish ? 'Removed from Wishlist' : 'Saved to Wishlist',
                    message: product.name,
                    image: product.image,
                  })
                }}
                aria-label={isWish ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <HeartIcon size={20} filled={isWish} />
              </button>
            </div>

            <div className="quickview-footer-link">
              <Link to={`/product/${product.id}`} onClick={onClose}>
                View full product specifications & reviews →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
