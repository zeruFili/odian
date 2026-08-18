import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../store/cart'
import { useMobileFilters } from '../store/filters'
import {
  BagIcon,
  ChevronDownIcon,
  CloseIcon,
  SearchIcon,
  UserIcon,
} from './Icons'

const NAV = [
  {
    label: 'Shop',
    href: '/',
    children: [
      { label: 'Shop', href: '/' },
      { label: 'New Arrivals', href: '/new-arrivals' },
      { label: 'Discount', href: '/discount' },
      { label: 'Simple Product', href: '/product/anti-pigmentation-serum' },
      { label: 'Variable Product', href: '/product/cosmetic-firming-serum' },
      { label: 'Grouped Product', href: '/product/hydrating-sheet-set' },
      { label: 'External Product', href: '/product/exfoliating-body-scrub' },
      { label: 'Out of stock Product', href: '/product/coconut-oil-lotion' },
    ],
  },
  {
    label: 'New Arrivals',
    href: '/new-arrivals',
  },
  {
    label: 'Discount',
    href: '/discount',
  },
  {
    label: 'Category',
    href: '/',
    mega: true,
  },
  {
    label: 'Offer',
    href: '/',
    mega: true,
  },
  {
    label: 'Pages',
    href: '/',
    children: [
      { label: 'Shop', href: '/' },
      { label: 'About us', href: '#' },
      { label: 'Contact us', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Cart', href: '#' },
      { label: 'Checkout', href: '#' },
      { label: 'Login', href: '#' },
      { label: '404', href: '#' },
    ],
  },
]

const MEGA_CATEGORIES = [
  {
    title: 'Skin care',
    image: '#f0dcd6',
    href: '#',
    items: ['Face cream', 'Face masks', 'Face balms', 'Face fluids', 'Serums, elixirs'],
  },
  {
    title: 'Body care',
    image: '#e4dccb',
    href: '#',
    items: ['Bath & shower', 'Foot cosmetics', 'Massage care'],
  },
  {
    title: 'Anti-aging',
    image: '#dfd8ee',
    href: '#',
    items: ['Ampoules', 'Activators', 'Peels', 'Boosters'],
  },
  {
    title: 'Organic',
    image: '#d4e2d2',
    href: '#',
    items: ['Masks', 'Elixirs', 'Body wraps'],
  },
]

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="logo" aria-label="ODILIA home">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="currentColor" />
        <circle cx="16" cy="16" r="9" fill="none" stroke={light ? '#fdf2f8' : '#fae9ea'} strokeWidth="2.4" />
        <circle cx="16" cy="16" r="3.2" fill={light ? '#fff' : '#fae9ea'} />
      </svg>
      <span className="logo__word">ODILIA</span>
    </Link>
  )
}

export default function Header() {
  const { count, openCart } = useCart()
  const { isOpen: filtersOpen, open: openFilters, close: closeFilters } = useMobileFilters()
  const { pathname } = useLocation()
  const isShopPage = pathname === '/'
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMegaOpen(null)
        setDropdown(null)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    if (!isShopPage && filtersOpen) closeFilters()
    if (isShopPage) setMobileOpen(false)
  }, [isShopPage, filtersOpen, closeFilters])

  return (
    <header className="header">
      <div className="header__inner container">
        <button
          className="header__burger"
          aria-label={isShopPage ? (filtersOpen ? 'Close filters' : 'Open filters') : 'Open menu'}
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
          {isShopPage ? (filtersOpen ? <CloseIcon /> : <span className="burger-lines"><i /><i /><i /></span>) : (mobileOpen ? <CloseIcon /> : <span className="burger-lines"><i /><i /><i /></span>)}
        </button>

        <div className="header__center">
          <Logo />
        </div>

        <div className="header__actions">
          <a href="#" className="header__contact">Contact</a>
          <div className="header__search">
            <button
              className="icon-btn"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </button>
            {searchOpen && (
              <div className="search-pop">
                <input ref={searchRef} className="search-input" placeholder="Search products…" />
              </div>
            )}
          </div>
          <button className="icon-btn" aria-label="Account">
            <UserIcon />
          </button>
          <button className="icon-btn cart-btn" aria-label="Open cart" onClick={openCart}>
            <BagIcon />
            <span className="cart-count">{count}</span>
          </button>
        </div>
      </div>

      <nav className="header__nav" ref={navRef} aria-label="Primary">
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
                <Link className="nav-link" to={item.href}>
                  {item.label}
                  {(item.children || item.mega) && <ChevronDownIcon size={16} />}
                </Link>
                {item.mega && megaOpen === item.label && (
                  <div className="mega">
                    <div className="mega__grid">
                      {MEGA_CATEGORIES.map((cat) => (
                        <a key={cat.title} href={cat.href} className="mega-card">
                          <span className="mega-card__img" style={{ background: cat.image }}>
                            <MegaIcon variant={cat.title.toLowerCase()} />
                          </span>
                          <span className="mega-card__title">{cat.title}</span>
                        </a>
                      ))}
                    </div>
                    <div className="mega__links">
                      {MEGA_CATEGORIES.map((cat) => (
                        <div className="mega__col" key={cat.title}>
                          <span className="mega__heading">{cat.title}</span>
                          <ul>
                            {cat.items.map((it) => (
                              <li key={it}>
                                <a href="#" className="mega__link">{it}</a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.children && dropdown === item.label && (
                  <ul className="dropdown">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link to={child.href} className="dropdown__link">{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-menu">
          <ul>
            {NAV.map((item) => (
              <li key={item.label}>
                {item.children || item.mega ? (
                  <button className="mobile-link" type="button">
                    {item.label} <ChevronDownIcon size={16} />
                  </button>
                ) : (
                  <Link to={item.href} className="mobile-link" onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <a href="#" className="btn btn--block">Contact</a>
        </div>
      )}
    </header>
  )
}

function MegaIcon({ variant }: { variant: string }) {
  const common = { fill: 'none', stroke: '#0c0a09', strokeWidth: 1.4, strokeLinecap: 'round' as const }
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">
      {variant.includes('skin') && <path d="M12 21c-4-1.5-7-5-7-9 0-4 3-7 7-9 4 2 7 5 7 9 0 4-3 7.5-7 9Z" {...common} />}
      {variant.includes('body') && <><path d="M4 6h16v12H4z" {...common} /><path d="M4 12h16" {...common} /></>}
      {variant.includes('aging') && <><circle cx="12" cy="12" r="8" {...common} /><path d="M12 8v8M8 12h8" {...common} /></>}
      {variant.includes('organic') && <path d="M11 20A7 7 0 0 1 4 13c0-4 3-7 8-9 5 2 8 5 8 9a7 7 0 0 1-7 7h-2Z" {...common} />}
    </svg>
  )
}
