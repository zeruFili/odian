import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { products, type Product } from '../data/products'
import { useCart } from '../store/cart'
import { useCurrency } from '../store/currency'
import { useWishlist } from '../store/wishlist'
import { useToast } from '../store/toast'
import ProductImage from './ProductImage'
import ProductCard from './ProductCard'
import QuickViewModal from './QuickViewModal'
import Footer from './Footer'
import {
  StarIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  RefreshCwIcon,
  LeafIcon,
  CheckIcon,
} from './Icons'

interface ReviewItem {
  name: string
  date: string
  rating: number
  title: string
  comment: string
  verified: boolean
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    name: 'Sophia Laurent',
    date: 'February 12, 2026',
    rating: 5,
    title: 'Transformative results in two weeks',
    comment:
      'My skin reacts to almost everything, but this formulation is soothing beyond belief. No redness, no burning, just hydrated, bouncy, healthy skin with an undeniable glow.',
    verified: true,
  },
  {
    name: 'Elena Rostova',
    date: 'January 28, 2026',
    rating: 5,
    title: 'The texture is pure luxury',
    comment:
      'It absorbs like silk without any heavy residue or stickiness. Makeup applies flawlessly over it. Truly medical-grade results wrapped in luxury packaging.',
    verified: true,
  },
  {
    name: 'Amara Kassa',
    date: 'January 14, 2026',
    rating: 4,
    title: 'High quality and authentic',
    comment:
      'Delivered in pristine condition in Addis Ababa. The formulation is gentle yet noticeably effective for tightening pores and brightening my skin tone.',
    verified: true,
  },
  {
    name: 'Chloe Vandenberg',
    date: 'December 20, 2025',
    rating: 5,
    title: 'Permanent staple in my skincare ritual',
    comment:
      'A little goes such a long way. After a month of consistent use, my hyperpigmentation has faded significantly and my texture is completely smoothed out.',
    verified: true,
  },
]

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { addToCart, openCart } = useCart()
  const { format } = useCurrency()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { showToast } = useToast()

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'desc' | 'how' | 'ingredients' | 'reviews'>('desc')
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(INITIAL_REVIEWS)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  // Review Form Modal / Inline State
  const [reviewFormOpen, setReviewFormOpen] = useState(false)
  const [reviewerName, setReviewerName] = useState('')
  const [reviewerRating, setReviewerRating] = useState(5)
  const [reviewerTitle, setReviewerTitle] = useState('')
  const [reviewerComment, setReviewerComment] = useState('')

  const product = useMemo(() => products.find((p) => p.id === id), [id])

  useEffect(() => {
    setQuantity(1)
    setAdded(false)
    setActiveImage(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  if (!product) {
    return (
      <>
        <div className="container pd-notfound">
          <h1 className="pd-notfound__title">Product Not Found</h1>
          <p className="pd-notfound__sub">
            The formulation you are searching for may have been archived or relocated.
          </p>
          <Link to="/" className="btn btn--primary">
            Explore All Products
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const gallery = Array.from(
    new Set([product.image, ...(product.images ?? [])].filter((img): img is string => Boolean(img))),
  )

  const related = getRelatedProducts(product)
  const isOutOfStock = product.type === 'outofstock'
  const isWish = isWishlisted(product.id)

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0

  const handleAdd = () => {
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
    setTimeout(() => setAdded(false), 1800)
  }

  const handleBuyNow = () => {
    if (isOutOfStock) return
    addToCart(product.id, quantity)
    openCart()
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewerName.trim() || !reviewerComment.trim()) return

    const newRev: ReviewItem = {
      name: reviewerName.trim(),
      date: 'Just now',
      rating: reviewerRating,
      title: reviewerTitle.trim() || 'Verified Customer Review',
      comment: reviewerComment.trim(),
      verified: true,
    }

    setReviewsList((prev) => [newRev, ...prev])
    setReviewFormOpen(false)
    setReviewerName('')
    setReviewerTitle('')
    setReviewerComment('')
    showToast({
      title: 'Review Submitted',
      message: 'Thank you for sharing your experience with our community!',
    })
  }

  return (
    <>
      <div className="pd-page">
        {/* Breadcrumb */}
        <div className="container pd-breadcrumb-wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb__sep">/</span>
            <Link to="/">Shop</Link>
            <span className="breadcrumb__sep">/</span>
            <Link to={`/?category=${encodeURIComponent(product.category)}`}>
              {product.category}
            </Link>
            <span className="breadcrumb__sep">/</span>
            <span aria-current="page">{product.name}</span>
          </nav>
        </div>

        <section className="container pd-hero-section">
          <div className="pd-grid">
            {/* Gallery Left */}
            <div className="pd-gallery-col">
              <div className="pd-main-image-wrap">
                <ProductImage product={product} src={gallery[activeImage]} priority={true} />

                {/* Badges */}
                <div className="pd-badges-overlay">
                  {discountPercent > 0 && (
                    <span className="card__badge card__badge--sale">Save {discountPercent}%</span>
                  )}
                  {product.badge === 'bestseller' && (
                    <span className="card__badge card__badge--best">Bestseller</span>
                  )}
                  {product.badge === 'new' && (
                    <span className="card__badge card__badge--new">New Arrival</span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  className={`pd-wishlist-toggle ${isWish ? 'is-active' : ''}`}
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

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="pd-thumbs-strip">
                  {gallery.map((img, i) => (
                    <button
                      className={`pd-thumb-btn ${i === activeImage ? 'is-active' : ''}`}
                      key={i}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View photo ${i + 1}`}
                      type="button"
                    >
                      <ProductImage product={product} src={img} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Right */}
            <div className="pd-info-col">
              <div className="pd-header-meta">
                <span className="pd-category-label">{product.category}</span>
                {product.brand && <span className="pd-brand-label">· {product.brand}</span>}
                {product.location && (
                  <span className="pd-location-label">📍 {product.location}</span>
                )}
              </div>

              <h1 className="pd-title">{product.name}</h1>

              {/* Rating Summary */}
              <div className="pd-rating-bar">
                <div className="stars" aria-label={`Rated ${product.rating} out of 5`}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon
                      key={i}
                      size={15}
                      className={i <= Math.round(product.rating) ? 'star star--on' : 'star'}
                    />
                  ))}
                </div>
                <span className="pd-rating-val">{product.rating.toFixed(1)}</span>
                <span className="pd-rating-divider">·</span>
                <a
                  href="#reviews"
                  className="pd-reviews-link"
                  onClick={() => setActiveTab('reviews')}
                >
                  {reviewsList.length} verified customer reviews
                </a>
              </div>

              {/* Price Block */}
              <div className="pd-price-block">
                {product.type === 'variable' || product.type === 'grouped' ? (
                  <span className="price price--lg">
                    {format(product, product.price)} – {format(product, product.priceMax ?? product.price)}
                  </span>
                ) : product.compareAtPrice ? (
                  <div className="pd-price-dual">
                    <span className="price price--lg price--current">
                      {format(product, product.price)}
                    </span>
                    <del className="price price--old">
                      {format(product, product.compareAtPrice)}
                    </del>
                    <span className="price-save-pill">
                      Save {discountPercent}% ({format(product, product.compareAtPrice - product.price)})
                    </span>
                  </div>
                ) : (
                  <span className="price price--lg">{format(product, product.price)}</span>
                )}
              </div>

              <p className="pd-short-desc">{product.description}</p>

              {/* Skin Types Chips */}
              <div className="pd-skin-types">
                <span className="pd-skin-label">Formulated for:</span>
                <div className="pd-skin-chips">
                  {product.skinTypes.map((st) => (
                    <span key={st} className="skin-pill">
                      {st} Skin
                    </span>
                  ))}
                </div>
              </div>

              {/* Stock Urgency */}
              <div className="pd-stock-status">
                {isOutOfStock ? (
                  <span className="stock-badge stock-badge--out">
                    Currently Sold Out — Restocking Soon
                  </span>
                ) : (
                  <span className="stock-badge stock-badge--in">
                    ✓ In Stock & Ready to Dispatch within 24 Hours
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pd-actions-panel">
                {!isOutOfStock && (
                  <div className="qty-stepper pd-qty">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                )}

                <button
                  className={`btn btn--primary pd-add-btn ${added ? 'is-added' : ''}`}
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                >
                  {added ? (
                    <>
                      <CheckIcon size={18} /> Added to Shopping Bag
                    </>
                  ) : isOutOfStock ? (
                    'Sold Out'
                  ) : (
                    'Add to Shopping Bag'
                  )}
                </button>

                {!isOutOfStock && (
                  <button
                    className="btn btn--secondary pd-buy-btn"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                )}
              </div>

              {/* Value Propositions */}
              <div className="pd-trust-grid">
                <div className="trust-card">
                  <TruckIcon size={20} />
                  <div>
                    <strong>Complimentary Delivery</strong>
                    <span>On orders above $50</span>
                  </div>
                </div>
                <div className="trust-card">
                  <ShieldCheckIcon size={20} />
                  <div>
                    <strong>100% Authentic Guarantee</strong>
                    <span>Sourced directly from verified labs</span>
                  </div>
                </div>
                <div className="trust-card">
                  <LeafIcon size={20} />
                  <div>
                    <strong>Clean Botanical Science</strong>
                    <span>Free from sulfates, parabens & toxins</span>
                  </div>
                </div>
                <div className="trust-card">
                  <RefreshCwIcon size={20} />
                  <div>
                    <strong>30-Day Happiness Guarantee</strong>
                    <span>Hassle-free complimentary returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabbed In-Depth Information */}
        <section className="container pd-tabs-section" id="reviews">
          <div className="pd-tab-navigation" role="tablist">
            <button
              className={`pd-tab-btn ${activeTab === 'desc' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('desc')}
              role="tab"
            >
              Formula & Science
            </button>
            <button
              className={`pd-tab-btn ${activeTab === 'how' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('how')}
              role="tab"
            >
              Ritual & How to Use
            </button>
            <button
              className={`pd-tab-btn ${activeTab === 'ingredients' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('ingredients')}
              role="tab"
            >
              Active Ingredients
            </button>
            <button
              className={`pd-tab-btn ${activeTab === 'reviews' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('reviews')}
              role="tab"
            >
              Customer Reviews ({reviewsList.length})
            </button>
          </div>

          <div className="pd-tab-content-card">
            {activeTab === 'desc' && (
              <div className="tab-pane">
                <h3 className="tab-pane-title">The Science of {product.name}</h3>
                <p>
                  Engineered in collaboration with leading cosmetic biochemists, this clinical-grade
                  formula brings together pure botanical extracts and advanced bio-fermented actives.
                  Unlike standard skincare products that only address surface symptoms, ODILIA's
                  cellular delivery system penetrates deep into the stratum corneum to restore cellular
                  resilience, prevent lipid barrier degradation, and stimulate natural collagen matrix synthesis.
                </p>
                <div className="science-highlights">
                  <div className="science-highlight-box">
                    <span className="science-num">98%</span>
                    <span className="science-label">Reported instant hydration surge within 10 minutes</span>
                  </div>
                  <div className="science-highlight-box">
                    <span className="science-num">94%</span>
                    <span className="science-label">Noticed visible reduction in hyperpigmentation after 14 days</span>
                  </div>
                  <div className="science-highlight-box">
                    <span className="science-num">100%</span>
                    <span className="science-label">Dermatologist tested safe for sensitive skin types</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'how' && (
              <div className="tab-pane">
                <h3 className="tab-pane-title">Recommended Application Ritual</h3>
                <div className="routine-steps">
                  <div className="routine-step">
                    <span className="step-num">Step 01</span>
                    <h4>Cleanse & Prep</h4>
                    <p>Dispense onto cleansed skin. Tone face and neck with hydrating essence to maximize absorption.</p>
                  </div>
                  <div className="routine-step">
                    <span className="step-num">Step 02</span>
                    <h4>Gently Press</h4>
                    <p>Warm 3–4 drops or a pea-sized amount between fingertips. Press smoothly into face, neck, and décolleté in upward motions.</p>
                  </div>
                  <div className="routine-step">
                    <span className="step-num">Step 03</span>
                    <h4>Seal & Protect</h4>
                    <p>Follow with your barrier cream in the evening or a broad-spectrum SPF 50 shield during morning rituals.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="tab-pane">
                <h3 className="tab-pane-title">Key Actives & Botanical Potency</h3>
                <ul className="ingredient-list">
                  <li>
                    <strong>Plant Squalane & Ceramide NP:</strong> Biomimetic lipid replenisher that prevents trans-epidermal water loss and strengthens compromised barriers.
                  </li>
                  <li>
                    <strong>Micro-Hyaluronic Acid Complex:</strong> Multi-weight molecular spheres that penetrate both the dermis and epidermis for multi-depth plumping.
                  </li>
                  <li>
                    <strong>Centella Asiatica (Cica) & Madecassoside:</strong> Ancient medicinal herb renowned for calming inflammation, soothing irritation, and speeding skin healing.
                  </li>
                  <li>
                    <strong>Niacinamide (Vitamin B3):</strong> Clinical active that visibly minimizes pore diameters, balances sebum production, and brightens dark spots.
                  </li>
                </ul>
                <p className="clean-promise-note">
                  <strong>Full INCI:</strong> Water/Aqua/Eau, Glycerin, Propanediol, Squalane, Niacinamide, Sodium Hyaluronate, Centella Asiatica Extract, Tocopherol, Camellia Sinensis Leaf Extract, Ethylhexylglycerin.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-pane reviews-tab-pane">
                <div className="reviews-summary-header">
                  <div className="reviews-overall-score">
                    <span className="overall-big-num">{product.rating.toFixed(1)}</span>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarIcon
                          key={i}
                          size={18}
                          className={i <= Math.round(product.rating) ? 'star star--on' : 'star'}
                        />
                      ))}
                    </div>
                    <span className="overall-count">Based on {reviewsList.length} verified ratings</span>
                  </div>

                  <button
                    className="btn btn--outline write-review-btn"
                    onClick={() => setReviewFormOpen(!reviewFormOpen)}
                  >
                    {reviewFormOpen ? 'Cancel Review' : 'Write a Review'}
                  </button>
                </div>

                {/* Review submission form */}
                {reviewFormOpen && (
                  <form onSubmit={handleReviewSubmit} className="review-form-card">
                    <h4>Share Your Experience</h4>
                    <div className="review-form-row">
                      <div className="form-group">
                        <label>Your Name</label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="e.g. Sarah Jenkins"
                        />
                      </div>
                      <div className="form-group">
                        <label>Rating</label>
                        <select
                          value={reviewerRating}
                          onChange={(e) => setReviewerRating(Number(e.target.value))}
                        >
                          <option value={5}>★★★★★ (5 out of 5 - Extraordinary)</option>
                          <option value={4}>★★★★☆ (4 out of 5 - Very Good)</option>
                          <option value={3}>★★★☆☆ (3 out of 5 - Average)</option>
                          <option value={2}>★★☆☆☆ (2 out of 5 - Below Expectations)</option>
                          <option value={1}>★☆☆☆☆ (1 out of 5 - Disappointing)</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Review Headline</label>
                      <input
                        type="text"
                        value={reviewerTitle}
                        onChange={(e) => setReviewerTitle(e.target.value)}
                        placeholder="e.g. Visibly transformed my skin in 2 weeks!"
                      />
                    </div>
                    <div className="form-group">
                      <label>Your Review</label>
                      <textarea
                        rows={3}
                        required
                        value={reviewerComment}
                        onChange={(e) => setReviewerComment(e.target.value)}
                        placeholder="Describe texture, smell, absorption, and visible changes you observed…"
                      />
                    </div>
                    <button type="submit" className="btn btn--primary">
                      Submit Verified Review
                    </button>
                  </form>
                )}

                {/* Review cards */}
                <div className="reviews-cards-list">
                  {reviewsList.map((rev, idx) => (
                    <div key={idx} className="review-card-item">
                      <div className="review-card-header">
                        <div className="review-avatar">
                          {rev.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="review-author-meta">
                          <div className="review-author-name">
                            <strong>{rev.name}</strong>
                            {rev.verified && (
                              <span className="verified-badge">✓ Verified Buyer</span>
                            )}
                          </div>
                          <span className="review-date">{rev.date}</span>
                        </div>
                        <div className="stars review-stars">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <StarIcon
                              key={i}
                              size={13}
                              className={i <= rev.rating ? 'star star--on' : 'star'}
                            />
                          ))}
                        </div>
                      </div>
                      <h5 className="review-title">{rev.title}</h5>
                      <p className="review-body-text">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Products Carousel */}
        <section className="container pd-related-section">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">Complementary Care</span>
              <h2 className="section-heading">Complete Your Daily Routine</h2>
            </div>
            <Link to="/" className="section-link">
              Explore Catalog →
            </Link>
          </div>

          <ul className="grid grid--4-col">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={addToCart}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </ul>
        </section>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

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
