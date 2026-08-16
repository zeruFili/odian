import { useEffect } from 'react'
import { useCart } from '../store/cart'
import ProductImage from './ProductImage'
import { CloseIcon } from './Icons'

export default function CartDrawer() {
  const { lines, isOpen, closeCart, subtotal, removeFromCart, setQuantity, count } = useCart()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeCart])

  return (
    <>
      <div className={`drawer-overlay ${isOpen ? 'is-open' : ''}`} onClick={closeCart} aria-hidden="true" />
      <aside className={`drawer ${isOpen ? 'is-open' : ''}`} aria-label="Shopping cart" aria-hidden={!isOpen}>
        <div className="drawer__header">
          <h2 className="drawer__title">Your cart (items: {count})</h2>
          <button className="icon-btn" onClick={closeCart} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p className="drawer__empty-title">Your cart is currently empty!</p>
            <button className="btn" onClick={closeCart}>Start shopping</button>
          </div>
        ) : (
          <>
            <div className="drawer__body">
              <div className="drawer__cols">
                <span className="drawer__col-label">Product</span>
                <span className="drawer__col-label">Details</span>
                <span className="drawer__col-label drawer__col-label--right">Total</span>
              </div>
              <ul className="drawer__lines">
                {lines.map((line) => (
                  <li className="drawer-line" key={line.product.id}>
                    <div className="drawer-line__thumb">
                      <ProductImage product={line.product} />
                    </div>
                    <div className="drawer-line__info">
                      <span className="drawer-line__name">{line.product.name}</span>
                      <span className="drawer-line__price">${line.product.price.toFixed(2)}</span>
                      <div className="drawer-line__qty">
                        <button onClick={() => setQuantity(line.product.id, line.quantity - 1)} aria-label="Decrease quantity">−</button>
                        <span>{line.quantity}</span>
                        <button onClick={() => setQuantity(line.product.id, line.quantity + 1)} aria-label="Increase quantity">+</button>
                      </div>
                    </div>
                    <div className="drawer-line__total">
                      <span>${(line.product.price * line.quantity).toFixed(2)}</span>
                      <button className="drawer-line__remove" onClick={() => removeFromCart(line.product.id)} aria-label="Remove item">
                        <CloseIcon size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="drawer__footer">
              <div className="drawer__subtotal">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <p className="drawer__note">Shipping and discounts calculated at checkout.</p>
              <div className="drawer__actions">
                <button className="btn btn--outline" onClick={closeCart}>View my cart</button>
                <button className="btn">Go to checkout</button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
