import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../store/cart'
import { useCurrency } from '../store/currency'
import { formatPrice, priceInUsd } from '../data/products'
import ProductImage from './ProductImage'
import { CloseIcon, ShieldCheckIcon, TruckIcon } from './Icons'

const FREE_SHIPPING_THRESHOLD_USD = 75

export default function CartDrawer() {
  const { lines, isOpen, closeCart, subtotal, removeFromCart, setQuantity, count } = useCart()
  const { currency, format } = useCurrency()

  const [promoCode, setPromoCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [promoApplied, setPromoApplied] = useState('')
  const [noteOpen, setNoteOpen] = useState(false)
  const [orderNote, setOrderNote] = useState('')

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

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError('')
    const code = promoCode.trim().toUpperCase()
    if (code === 'RADIANCE20') {
      setDiscountPercent(20)
      setPromoApplied('RADIANCE20 (20% OFF)')
      setPromoCode('')
    } else if (code === 'WELCOME10') {
      setDiscountPercent(10)
      setPromoApplied('WELCOME10 (10% OFF)')
      setPromoCode('')
    } else {
      setPromoError('Invalid coupon code. Try RADIANCE20')
    }
  }

  const discountAmount = (subtotal * discountPercent) / 100
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_USD
  const shippingCost = isFreeShipping || subtotal === 0 ? 0 : 5.99
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost)

  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD_USD) * 100))
  const amountLeftForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - subtotal)

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? 'is-open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`drawer ${isOpen ? 'is-open' : ''}`}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <div className="drawer__header">
          <div className="drawer-title-group">
            <h2 className="drawer__title">Shopping Bag</h2>
            <span className="drawer__item-pill">{count} {count === 1 ? 'item' : 'items'}</span>
          </div>
          <button className="icon-btn" onClick={closeCart} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="free-shipping-bar">
          <div className="free-shipping-text">
            <TruckIcon size={18} />
            {isFreeShipping ? (
              <span>
                <strong>Complimentary Express Shipping</strong> Unlocked! 🎉
              </span>
            ) : (
              <span>
                Add <strong>${amountLeftForFreeShipping.toFixed(2)}</strong> more for{' '}
                <strong>Free Delivery</strong>
              </span>
            )}
          </div>
          <div className="shipping-progress-track">
            <div
              className="shipping-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <div className="drawer__empty-art" aria-hidden="true">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d6d3d1" strokeWidth="1.2">
                <path d="M5 8h14l-1 13H6L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
            </div>
            <p className="drawer__empty-title">Your shopping bag is empty</p>
            <p className="drawer__empty-sub">
              Explore our clean science skincare formulas and discover your personalized radiant routine.
            </p>
            <button className="btn btn--primary" onClick={closeCart}>
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="drawer__body">
              <ul className="drawer__lines">
                {lines.map((line) => {
                  const lineTotalInUsd = priceInUsd(line.product) * line.quantity
                  return (
                    <li className="drawer-line" key={line.product.id}>
                      <Link
                        to={`/product/${line.product.id}`}
                        className="drawer-line__thumb"
                        onClick={closeCart}
                      >
                        <ProductImage product={line.product} />
                      </Link>
                      <div className="drawer-line__info">
                        <span className="drawer-line__cat">{line.product.category}</span>
                        <Link
                          to={`/product/${line.product.id}`}
                          className="drawer-line__name"
                          onClick={closeCart}
                        >
                          {line.product.name}
                        </Link>
                        <span className="drawer-line__price">
                          {format(line.product, line.product.price)}
                        </span>

                        <div className="drawer-line__qty-wrap">
                          <div className="drawer-line__qty">
                            <button
                              onClick={() => setQuantity(line.product.id, line.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span>{line.quantity}</span>
                            <button
                              onClick={() => setQuantity(line.product.id, line.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <div className="drawer-line__total">
                            {currency === 'ETB'
                              ? `ETB ${Math.round(lineTotalInUsd * 130).toLocaleString()}`
                              : `$${lineTotalInUsd.toFixed(2)}`}
                          </div>
                        </div>
                      </div>

                      <button
                        className="drawer-line__remove"
                        onClick={() => removeFromCart(line.product.id)}
                        aria-label={`Remove ${line.product.name} from bag`}
                      >
                        <CloseIcon size={14} />
                      </button>
                    </li>
                  )
                })}
              </ul>

              {/* Coupon Accordion */}
              <div className="drawer-coupon-section">
                {promoApplied ? (
                  <div className="promo-applied-badge">
                    <span>✓ Promo applied: <strong>{promoApplied}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setDiscountPercent(0)
                        setPromoApplied('')
                      }}
                      className="promo-remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="promo-form">
                    <input
                      type="text"
                      className="promo-input"
                      placeholder="Coupon code (e.g. RADIANCE20)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button type="submit" className="btn btn--sm promo-btn">
                      Apply
                    </button>
                  </form>
                )}
                {promoError && <p className="promo-error">{promoError}</p>}
              </div>

              {/* Order note accordion */}
              <div className="drawer-note-section">
                <button
                  type="button"
                  className="drawer-note-toggle"
                  onClick={() => setNoteOpen(!noteOpen)}
                >
                  {noteOpen ? '− Hide gift note' : '+ Add gift note or special instructions'}
                </button>
                {noteOpen && (
                  <textarea
                    className="drawer-note-textarea"
                    rows={2}
                    placeholder="Write a message for your recipient or delivery notes…"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                  />
                )}
              </div>
            </div>

            <div className="drawer__footer">
              <div className="drawer__breakdown">
                <div className="drawer__row">
                  <span>Subtotal</span>
                  <span>
                    {currency === 'ETB'
                      ? `ETB ${Math.round(subtotal * 130).toLocaleString()}`
                      : `$${subtotal.toFixed(2)}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="drawer__row drawer__row--discount">
                    <span>Discount ({discountPercent}%)</span>
                    <span>
                      -{currency === 'ETB'
                        ? `ETB ${Math.round(discountAmount * 130).toLocaleString()}`
                        : `$${discountAmount.toFixed(2)}`}
                    </span>
                  </div>
                )}
                <div className="drawer__row">
                  <span>Estimated Delivery</span>
                  <span>{isFreeShipping ? 'Complimentary' : '$5.99'}</span>
                </div>
                <div className="drawer__row drawer__row--total">
                  <span>Estimated Total</span>
                  <span>
                    {currency === 'ETB'
                      ? `ETB ${Math.round(finalTotal * 130).toLocaleString()}`
                      : `$${finalTotal.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="drawer__actions">
                <button
                  className="btn btn--block btn--primary drawer__checkout-btn"
                  onClick={() => {
                    alert('Order preview confirmed! Ready for checkout integration.')
                  }}
                >
                  Proceed to Secure Checkout
                </button>
                <button
                  className="btn btn--block btn--ghost"
                  onClick={closeCart}
                >
                  Continue Shopping
                </button>
              </div>

              <div className="drawer__trust">
                <div className="trust-item">
                  <ShieldCheckIcon size={16} />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
                <div className="trust-item">
                  <TruckIcon size={16} />
                  <span>Eco-Conscious Sustainable Packaging</span>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
