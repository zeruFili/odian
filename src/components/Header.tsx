import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../store/cart'
import { useWishlist } from '../store/wishlist'
import { useCurrency } from '../store/currency'
import { useMobileFilters } from '../store/filters'
import { products, type Product } from '../data/products'
import ProductImage from './ProductImage'
import {
  BagIcon,
  ChevronDownIcon,
  CloseIcon,
  HeartIcon,
  SearchIcon,
  UserIcon,
} from './Icons'

const NAV = [
  {
    label: 'Shop',
    href: '/',
    children: [
      { label: 'All Products', href: '/' },
      { label: 'New Arrivals', href: '/new-arrivals' },
      { label: 'Promotions & Discounts', href: '/discount' },
      { label: 'Radiance Renewal Serum', href: '/product/lumiere-radiance-serum' },
      { label: 'Collagen Renewal Cream', href: '/product/collagen-face-cream' },
      { label: 'Hydration Mask Set', href: '/product/hydrating-sheet-set' },
      { label: 'Daily Defense SPF 50', href: '/product/sunscreen-spf50' },
      { label: 'Squalane Glow Face Oil', href: '/product/squalane-face-oil' },
    ],
  },
  {
    label: 'New Arrivals',
    href: '/new-arrivals',
  },
  {
    label: 'Discounts',
    href: '/discount',
  },
  {
    label: 'Categories',
    href: '/',
    mega: true,
  },
  {
    label: 'Rituals & Care',
    href: '/',
    children: [
      { label: 'Morning Glow Routine', href: '/' },
      { label: 'Night Repair Treatment', href: '/' },
      { label: 'Anti-Pigmentation Regimen', href: '/' },
      { label: 'Sensitive Skin Solutions', href: '/' },
    ],
  },
]

const MEGA_CATEGORIES = [
  {
    title: 'Face Care',
    desc: 'Clinical science for radiant skin',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    href: '/?category=Face+Care',
    items: ['Serums & Boosters', 'Face Creams', 'AHA Cleansers', 'Night Masks', 'Eye Treatments'],
  },
  {
    title: 'Body Care',
    desc: 'Nourishing botanical elixirs',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    href: '/?category=Body+Care',
    items: ['Whipped Shea Butter', 'Mineral Polishes', 'Purifying Washes', 'Hydrating Lotions'],
  },
  {
    title: 'Treatments',
    desc: 'Targeted corrective formulations',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=400&q=80',
    href: '/?category=Treatments',
    items: ['Broad-Spectrum SPF 50', 'Pure Retinol Elixirs', 'Thiamidol Serums', 'Centella Sun Fluid'],
  },
  {
    title: 'Hair & Scalp',
    desc: 'Deep revitalizing care',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&q=80',
    href: '/?category=Hair+Care',
    items: ['Rosemary Infusion Oil', 'Pure Argan Elixir', 'Keratin Repair Mask', 'Minoxidil Regrowth'],
  },
]

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="logo" aria-label="ODILIA home">
      <div className="logo__mark" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="15" fill={light ? '#ffffff' : '#141210'} />
          <circle
            cx="16"
            cy="16"
            r="9.5"
            fill="none"
            stroke={light ? '#141210' : '#c59b6d'}
            strokeWidth="1.8"
            strokeDasharray="2 1.5"
          />
          <circle cx="16" cy="16" r="3.2" fill={light ? '#141210' : '#ffffff'} />
        </svg>
      </div>
      <div className="logo__text">
        <span className="logo__word">ODILIA</span>
        <span className="logo__sub">SKINCARE SCIENCE</span>
      </div>
    </Link>
  )
}

export default function Header() {
  const { count, openCart } = useCart()
  const { count: wishCount, openWishlist } = useWishlist()
  const { currency, toggleCurrency, format } = useCurrency()
  const { isOpen: filtersOpen, open: openFilters, close: closeFilters } = useMobileFilters()
  const { pathname } = useLocation()
  const isShopPage = pathname === '/'

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const [dropdown, setDropdown] = useState<string | null>(null)

  const navRef = useRef<HTMLElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMegaOpen(null)
        setDropdown(null)
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 50)
    } else {
      setSearchQuery('')
    }
  }, [searchOpen])

  useEffect(() => {
    if (!isShopPage && filtersOpen) closeFilters()
    if (isShopPage) setMobileOpen(false)
    setMegaOpen(null)
    setDropdown(null)
    setSearchOpen(false)
  }, [pathname, isShopPage, filtersOpen, closeFilters])

  // Instant live search matches
  const searchResults: Product[] = searchQuery.trim().length > 1
    ? products
        .filter((p) => {
          const q = searchQuery.toLowerCase()
          return (
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.categories.some((c) => c.toLowerCase().includes(q)) ||
            (p.brand && p.brand.toLowerCase().includes(q)) ||
            p.description.toLowerCase().includes(q)
          )
        })
        .slice(0, 5)
    : []

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="container announcement-bar__inner">
          <div className="announcement-text">
            <span className="announcement-pill">Exclusive Offer</span>
            <span>Complimentary luxury travel samples with every order above $50 · Code: <strong>RADIANCE20</strong> for 20% off</span>
          </div>
          <div className="announcement-right">
            <button
              className="currency-toggle-btn"
              onClick={toggleCurrency}
              aria-label={`Switch currency (Current: ${currency})`}
              title="Click to toggle between USD ($) and Ethiopian Birr (ETB)"
            >
              <span className="currency-globe" aria-hidden="true">🌐</span>
              <span className="currency-name">{currency === 'USD' ? 'USD ($)' : 'ETB (Br)'}</span>
              <span className="currency-switch-hint">Switch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <div className="header__inner container">
          {/* Mobile hamburger or filter toggle */}
          <div className="header__left">
            <button
              className="header__burger"
              aria-label={isShopPage ? (filtersOpen ? 'Close filters' : 'Open filters') : 'Open navigation'}
              aria-expanded={isShopPage ? filtersOpen : mobileOpen}
              onClick={() => {
                if (isShopPage) {
                  filtersOpen ? closeFilters() : openFilters()
                  setMobileOpen(false)
                } else {
                  setMobileOpen((v) => !v)
                }
              }}
            >
              {isShopPage ? (
                filtersOpen ? <CloseIcon /> : <span className="burger-lines"><i /><i /><i /></span>
              ) : mobileOpen ? (
                <CloseIcon />
              ) : (
                <span className="burger-lines"><i /><i /><i /></span>
              )}
            </button>

            {/* Desktop Brand Tagline */}
            <span className="header__tagline d-none-mobile">
              Botanical Science & Luxury Formulas
            </span>
          </div>

          {/* Logo Center */}
          <div className="header__center">
            <Logo />
          </div>

          {/* Action Icons Right */}
          <div className="header__actions">
            {/* Search Toggle & Popover */}
            <div className="header__search" ref={searchContainerRef}>
              <button
                className="icon-btn"
                aria-label={searchOpen ? 'Close search' : 'Search products'}
                onClick={() => setSearchOpen((v) => !v)}
              >
                {searchOpen ? <CloseIcon size={18} /> : <SearchIcon size={19} />}
              </button>

              {searchOpen && (
                <div className="search-popover" role="dialog" aria-label="Search catalog">
                  <div className="search-popover__input-wrap">
                    <SearchIcon size={18} className="search-popover__icon" />
                    <input
                      ref={searchRef}
                      className="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search serums, cleansers, creams, SPF…"
                    />
                    {searchQuery && (
                      <button
                        className="search-clear-btn"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear query"
                      >
                        <CloseIcon size={14} />
                      </button>
                    )}
                  </div>

                  {/* Instant Live Results */}
                  {searchQuery.trim().length > 1 && (
                    <div className="search-results-list">
                      {searchResults.length > 0 ? (
                        <>
                          <div className="search-results-label">
                            Products ({searchResults.length})
                          </div>
                          <ul>
                            {searchResults.map((prod) => (
                              <li key={prod.id}>
                                <Link
                                  to={`/product/${prod.id}`}
                                  className="search-result-item"
                                  onClick={() => setSearchOpen(false)}
                                >
                                  <div className="search-result-thumb">
                                    <ProductImage product={prod} />
                                  </div>
                                  <div className="search-result-details">
                                    <span className="search-result-title">{prod.name}</span>
                                    <span className="search-result-cat">{prod.category}</span>
                                    <span className="search-result-price">{format(prod, prod.price)}</span>
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <div className="search-no-results">
                          <p>No products found for "{searchQuery}"</p>
                          <div className="search-suggestions">
                            <span>Popular searches:</span>
                            <button type="button" onClick={() => setSearchQuery('Serum')}>Serum</button>
                            <button type="button" onClick={() => setSearchQuery('Cleanser')}>Cleanser</button>
                            <button type="button" onClick={() => setSearchQuery('Cream')}>Cream</button>
                            <button type="button" onClick={() => setSearchQuery('SPF')}>SPF</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!searchQuery && (
                    <div className="search-quick-tags">
                      <span className="quick-tag-label">Trending Now:</span>
                      <button type="button" onClick={() => setSearchQuery('Serum')}>Radiance Serum</button>
                      <button type="button" onClick={() => setSearchQuery('SPF')}>Sun Protection</button>
                      <button type="button" onClick={() => setSearchQuery('CeraVe')}>CeraVe</button>
                      <button type="button" onClick={() => setSearchQuery('Retinol')}>Retinol</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              className="icon-btn wishlist-nav-btn"
              aria-label={`Open wishlist (${wishCount} items)`}
              onClick={openWishlist}
            >
              <HeartIcon size={19} filled={wishCount > 0} />
              {wishCount > 0 && <span className="wishlist-badge">{wishCount}</span>}
            </button>

            {/* Shopping Bag Button */}
            <button
              className="icon-btn cart-btn"
              aria-label={`Open shopping cart (${count} items)`}
              onClick={openCart}
            >
              <BagIcon size={19} />
              <span className="cart-count">{count}</span>
            </button>
          </div>
        </div>

        {/* Desktop Primary Navigation */}
        <nav className="header__nav" ref={navRef} aria-label="Primary navigation">
          <div className="container header__nav-inner">
            <ul className="nav-list">
              {NAV.map((item) => (
                <li
                  key={item.label}
                  className="nav-item"
                  onMouseEnter={() => {
                    setMegaOpen(item.mega ? item.label : null)
                    setDropdown(item.children ? item.label : null)
                  }}
                  onMouseLeave={() => {
                    setMegaOpen(null)
                    setDropdown(null)
                  }}
                >
                  <Link
                    className={`nav-link ${
                      item.label === 'Discounts' ? 'nav-link--accent' : ''
                    }`}
                    to={item.href}
                  >
                    {item.label}
                    {(item.children || item.mega) && <ChevronDownIcon size={14} />}
                  </Link>

                  {/* Mega Menu */}
                  {item.mega && megaOpen === item.label && (
                    <div className="mega-menu">
                      <div className="container mega-menu__inner">
                        <div className="mega-menu__grid">
                          {MEGA_CATEGORIES.map((cat) => (
                            <Link
                              key={cat.title}
                              to={cat.href}
                              className="mega-menu-card"
                              onClick={() => setMegaOpen(null)}
                            >
                              <div className="mega-menu-card__img-wrap">
                                <img src={cat.image} alt={cat.title} loading="lazy" />
                                <div className="mega-menu-card__overlay">
                                  <span className="mega-menu-card__explore">Shop Category →</span>
                                </div>
                              </div>
                              <div className="mega-menu-card__body">
                                <span className="mega-menu-card__title">{cat.title}</span>
                                <span className="mega-menu-card__desc">{cat.desc}</span>
                              </div>
                              <ul className="mega-menu-card__sublinks">
                                {cat.items.map((sub) => (
                                  <li key={sub}>
                                    <span className="mega-menu-sub-item">{sub}</span>
                                  </li>
                                ))}
                              </ul>
                            </Link>
                          ))}
                        </div>

                        <div className="mega-menu__featured-bar">
                          <div className="mega-featured-content">
                            <span className="featured-pill">New Formulation</span>
                            <h4>Overnight Cellular Repair Mask</h4>
                            <p>Infused with plant squalane and barrier lipids for awakened radiance.</p>
                          </div>
                          <Link
                            to="/product/night-repair-mask"
                            className="btn btn--sm btn--primary"
                            onClick={() => setMegaOpen(null)}
                          >
                            Discover Mask
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Standard Dropdown */}
                  {item.children && dropdown === item.label && (
                    <ul className="dropdown">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            to={child.href}
                            className="dropdown__link"
                            onClick={() => setDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile Slide-Out Drawer Navigation */}
        {mobileOpen && (
          <div className="mobile-menu-drawer">
            <div className="mobile-menu-inner">
              <div className="mobile-menu-header">
                <Logo />
                <button
                  className="icon-btn"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="mobile-menu-currency">
                <span className="mobile-currency-label">Store Currency:</span>
                <button className="currency-pill-btn" onClick={toggleCurrency}>
                  {currency === 'USD' ? 'US Dollar ($)' : 'Ethiopian Birr (ETB)'}
                </button>
              </div>

              <ul className="mobile-nav-list">
                {NAV.map((item) => (
                  <li key={item.label} className="mobile-nav-item">
                    <Link
                      to={item.href}
                      className="mobile-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>{item.label}</span>
                      <ChevronDownIcon size={16} />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mobile-menu-footer">
                <p className="mobile-menu-tagline">
                  Pure clean ingredients. Science-backed formulas.
                </p>
                <Link
                  to="/"
                  className="btn btn--block btn--primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Explore All Products
                </Link>
              </div>
            </div>
            <div
              className="mobile-menu-overlay"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
          </div>
        )}
      </header>
    </>
  )
}
