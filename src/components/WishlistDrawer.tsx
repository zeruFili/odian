import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../store/wishlist'
import { useCart } from '../store/cart'
import { useCurrency } from '../store/currency'
import { useToast } from '../store/toast'
import ProductImage from './ProductImage'
import { CloseIcon, HeartIcon, BagIcon } from './Icons'

export default function WishlistDrawer() {
  const { wishlistProducts, isOpen, closeWishlist, removeFromWishlist, count } = useWishlist()
  const { addToCart, openCart } = useCart()
  const { format } = useCurrency()
  const { showToast } = useToast()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeWishlist()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, closeWishlist])

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? 'is-open' : ''}`}
        onClick={closeWishlist}
        aria-hidden="true"
      />
      <aside
        className={`drawer wishlist-drawer ${isOpen ? 'is-open' : ''}`}
        aria-label="Wishlist"
        aria-hidden={!isOpen}
      >
        <div className="drawer__header">
          <div className="wishlist-drawer-title-group">
            <HeartIcon size={20} filled={true} />
            <h2 className="drawer__title">My Wishlist ({count})</h2>
          </div>
          <button className="icon-btn" onClick={closeWishlist} aria-label="Close wishlist">
            <CloseIcon />
          </button>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="drawer__empty">
            <div className="wishlist-empty-icon" aria-hidden="true">
              <HeartIcon size={48} strokeWidth={1.2} />
            </div>
            <p className="drawer__empty-title">Your wishlist is currently empty</p>
            <p className="drawer__empty-sub">
              Tap the heart icon on any product to save items you love for later.
            </p>
            <button className="btn btn--primary" onClick={closeWishlist}>
              Explore Skincare
            </button>
          </div>
        ) : (
          <>
            <div className="drawer__body">
              <ul className="drawer__lines">
                {wishlistProducts.map((product) => (
                  <li className="drawer-line wishlist-line" key={product.id}>
                    <Link
                      to={`/product/${product.id}`}
                      className="drawer-line__thumb"
                      onClick={closeWishlist}
                    >
                      <ProductImage product={product} />
                    </Link>
                    <div className="drawer-line__info">
                      <span className="wishlist-line-cat">{product.category}</span>
                      <Link
                        to={`/product/${product.id}`}
                        className="drawer-line__name"
                        onClick={closeWishlist}
                      >
                        {product.name}
                      </Link>
                      <span className="drawer-line__price">{format(product, product.price)}</span>

                      <div className="wishlist-line-actions">
                        {product.type !== 'outofstock' ? (
                          <button
                            className="btn btn--sm wishlist-add-cart-btn"
                            onClick={() => {
                              addToCart(product.id, 1)
                              showToast({
                                title: 'Added to Bag',
                                message: product.name,
                                image: product.image,
                                actionLabel: 'View Bag',
                                onAction: openCart,
                              })
                            }}
                          >
                            <BagIcon size={14} /> Add to Bag
                          </button>
                        ) : (
                          <span className="stock-badge stock-badge--out">Out of stock</span>
                        )}
                      </div>
                    </div>

                    <button
                      className="drawer-line__remove"
                      onClick={() => removeFromWishlist(product.id)}
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      <CloseIcon size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="drawer__footer">
              <div className="wishlist-drawer-actions">
                <button
                  className="btn btn--block btn--primary"
                  onClick={() => {
                    wishlistProducts.forEach((p) => {
                      if (p.type !== 'outofstock') addToCart(p.id, 1)
                    })
                    showToast({
                      title: 'All In-Stock Items Added',
                      message: 'Items have been moved to your shopping bag',
                      actionLabel: 'View Bag',
                      onAction: openCart,
                    })
                    closeWishlist()
                    openCart()
                  }}
                >
                  Move All In-Stock to Bag
                </button>
                <button className="btn btn--block btn--ghost" onClick={closeWishlist}>
                  Continue Shopping
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
