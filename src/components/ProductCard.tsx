import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { useCurrency } from '../store/currency'
import { useWishlist } from '../store/wishlist'
import { useToast } from '../store/toast'
import { useCart } from '../store/cart'
import ProductImage from './ProductImage'
import { EyeIcon, HeartIcon, StarIcon, CheckIcon } from './Icons'

interface Props {
  product: Product
  onAdd: (id: string) => void
  onQuickView?: (product: Product) => void
  listView?: boolean
}

export default function ProductCard({ product, onAdd, onQuickView, listView = false }: Props) {
  const { format } = useCurrency()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { openCart } = useCart()
  const { showToast } = useToast()
  const [added, setAdded] = useState(false)

  const isWish = isWishlisted(product.id)
  const isOutOfStock = product.type === 'outofstock'

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return

    onAdd(product.id)
    setAdded(true)
    showToast({
      title: 'Added to Shopping Bag',
      message: product.name,
      image: product.image,
      actionLabel: 'View Bag',
      onAction: openCart,
    })
    setTimeout(() => setAdded(false), 1600)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
    showToast({
      title: isWish ? 'Removed from Wishlist' : 'Saved to Wishlist',
      message: product.name,
      image: product.image,
    })
  }

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(product)
  }

  const addLabel =
    product.type === 'variable'
      ? 'Select options'
      : product.type === 'grouped'
      ? 'View set'
      : product.type === 'external'
      ? 'Shop official'
      : product.type === 'outofstock'
      ? 'Sold out'
      : 'Add to bag'

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0

  return (
    <li className={`card card--${product.type} ${listView ? 'card--list' : ''}`}>
      <div className="card__media">
        <Link to={`/product/${product.id}`} className="card__img-link" aria-label={product.name}>
          <ProductImage product={product} />
        </Link>

        {/* Badges */}
        <div className="card__badges">
          {product.badge === 'sale' && discountPercent > 0 && (
            <span className="card__badge card__badge--sale">Save {discountPercent}%</span>
          )}
          {product.badge === 'new' && <span className="card__badge card__badge--new">New</span>}
          {product.badge === 'bestseller' && (
            <span className="card__badge card__badge--best">Bestseller</span>
          )}
          {isOutOfStock && <span className="card__badge card__badge--oops">Sold out</span>}
        </div>

        {/* Wishlist Button */}
        <button
          className={`card__wish-btn ${isWish ? 'is-active' : ''}`}
          onClick={handleWishlist}
          aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
          type="button"
        >
          <HeartIcon size={17} filled={isWish} />
        </button>

        {/* Floating Quick Actions Bar */}
        <div className="card__hover-actions">
          {onQuickView && (
            <button
              className="card__quick-btn"
              onClick={handleQuickViewClick}
              type="button"
              aria-label={`Quick view ${product.name}`}
            >
              <EyeIcon size={15} />
              <span>Quick View</span>
            </button>
          )}
        </div>
      </div>

      <div className="card__body">
        <div className="card__category-line">
          <span className="card__category">{product.category}</span>
          {product.brand && <span className="card__brand">· {product.brand}</span>}
        </div>

        <h2 className="card__title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h2>

        {/* Rating Stars */}
        <div className="card__rating">
          <span className="stars" aria-label={`Rated ${product.rating} out of 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon
                key={i}
                size={12}
                className={i <= Math.round(product.rating) ? 'star star--on' : 'star'}
              />
            ))}
          </span>
          <span className="card__rating-text">
            <strong>{product.rating.toFixed(1)}</strong> ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="card__price">
          {product.type === 'variable' || product.type === 'grouped' ? (
            <span className="price">
              {format(product, product.price)} – {format(product, product.priceMax ?? product.price)}
            </span>
          ) : product.compareAtPrice ? (
            <>
              <span className="price price--current">{format(product, product.price)}</span>
              <del className="price price--old">{format(product, product.compareAtPrice)}</del>
            </>
          ) : (
            <span className="price">{format(product, product.price)}</span>
          )}
        </div>

        {/* Primary CTA */}
        <button
          className={`btn btn--block card__cta ${added ? 'is-added' : ''}`}
          onClick={handleAdd}
          disabled={isOutOfStock}
          type="button"
        >
          {added ? (
            <>
              <CheckIcon size={16} /> Added ✓
            </>
          ) : (
            addLabel
          )}
        </button>
      </div>
    </li>
  )
}
