import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import ProductImage from './ProductImage'
import { StarIcon } from './Icons'

interface Props {
  product: Product
  onAdd: (id: string) => void
}

export default function ProductCard({ product, onAdd }: Props) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    if (product.type === 'outofstock') return
    onAdd(product.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  const addLabel =
    product.type === 'variable' ? 'Select options' :
    product.type === 'grouped' ? 'View products' :
    product.type === 'external' ? 'Buy on Lumière Store' :
    product.type === 'outofstock' ? 'Read more' :
    'Add to cart'

  return (
    <li className={`card card--${product.type}`}>
      <div className="card__media">
        <Link to={`/product/${product.id}`} className="card__img-link" aria-label={product.name}>
          <ProductImage product={product} />
        </Link>
        {product.badge === 'sale' && product.compareAtPrice && (
          <span className="card__badge card__badge--sale">Sale</span>
        )}
        {product.badge === 'new' && <span className="card__badge card__badge--new">New</span>}
        {product.badge === 'bestseller' && <span className="card__badge card__badge--best">Bestseller</span>}
        {product.type === 'outofstock' && <span className="card__badge card__badge--oops">Out of stock</span>}
      </div>

      <div className="card__body">
        <h2 className="card__title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h2>

        <div className="card__price">
          {product.type === 'variable' || product.type === 'grouped' ? (
            <span className="price">${product.price.toFixed(2)} – ${(product.priceMax ?? product.price).toFixed(2)}</span>
          ) : product.compareAtPrice ? (
            <>
              <span className="price price--current">${product.price.toFixed(2)}</span>
              <del className="price price--old">${product.compareAtPrice.toFixed(2)}</del>
            </>
          ) : (
            <span className="price">${product.price.toFixed(2)}</span>
          )}
        </div>

        <button
          className={`btn btn--block card__cta ${added ? 'is-added' : ''}`}
          onClick={handleAdd}
          disabled={product.type === 'outofstock'}
        >
          {added ? 'Added ✓' : addLabel}
        </button>

        <div className="card__rating">
          <span className="stars" aria-label={`Rated ${product.rating} out of 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon key={i} size={13} className={i <= Math.round(product.rating) ? 'star star--on' : 'star'} />
            ))}
          </span>
          <span className="card__rating-text">{product.rating.toFixed(2)} out of 5</span>
        </div>
      </div>
    </li>
  )
}
