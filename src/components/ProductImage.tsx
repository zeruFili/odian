import { useEffect, useState } from 'react'
import type { Product } from '../data/products'

interface Props {
  product: Product
  /** Optional image override (e.g. a specific gallery image). */
  src?: string
  alt?: string
  className?: string
  priority?: boolean
}

function shade(hex: string, percent: number): string {
  const n = hex.replace('#', '')
  const num = parseInt(n, 16)
  const amt = Math.round(2.55 * percent)
  const r = Math.max(0, Math.min(255, (num >> 16) + amt))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt))
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function pickVariant(product: Product): 'bottle' | 'jar' | 'tube' {
  const n = product.id.toLowerCase()
  if (
    n.includes('mask') ||
    n.includes('cream') ||
    n.includes('butter') ||
    n.includes('scrub') ||
    n.includes('polish') ||
    n.includes('eye')
  ) {
    return 'jar'
  }
  if (
    n.includes('wash') ||
    n.includes('lotion') ||
    n.includes('foam') ||
    n.includes('toner') ||
    n.includes('mist') ||
    n.includes('oil') ||
    n.includes('serum') ||
    n.includes('booster') ||
    n.includes('gel')
  ) {
    return 'bottle'
  }
  return 'tube'
}

export default function ProductImage({ product, src, alt, className = '', priority = false }: Props) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const imageSrc = src ?? product.image

  useEffect(() => {
    setFailed(false)
    setLoaded(false)
  }, [imageSrc])

  const variant = pickVariant(product)
  const c1 = product.swatch || '#f3e3d7'
  const c2 = product.swatch2 ?? shade(c1, 18)
  const accent = product.accents?.[0] || '#c98a5f'
  const label = product.accents?.[1] ?? '#ffffff'
  const cap = product.accents?.[2] ?? shade(c1, -30)

  if (imageSrc && !failed) {
    return (
      <div className={`product-img-wrap ${loaded ? 'is-loaded' : 'is-loading'} ${className}`}>
        {!loaded && <div className="product-img-skeleton" aria-hidden="true" />}
        <img
          src={imageSrc}
          alt={alt ?? product.name}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="product-img-elem"
        />
      </div>
    )
  }

  // Graceful luxury SVG fallback if image cannot be loaded
  return (
    <div className={`product-img-wrap is-fallback ${className}`}>
      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-label={product.name}
        className="product-img-fallback-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`bg-${product.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#faf7f4" />
            <stop offset="100%" stopColor="#f0e9e1" />
          </linearGradient>
          <linearGradient id={`body-${variant}-${product.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={shade(c1, 8)} />
            <stop offset="55%" stopColor={c1} />
            <stop offset="100%" stopColor={shade(c2, 6)} />
          </linearGradient>
          <linearGradient id={`accent-${product.id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={shade(accent, 6)} />
            <stop offset="100%" stopColor={shade(accent, -12)} />
          </linearGradient>
          <linearGradient id={`cap-${product.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={shade(cap, 14)} />
            <stop offset="100%" stopColor={shade(cap, -10)} />
          </linearGradient>
        </defs>

        <rect width="200" height="200" fill={`url(#bg-${product.id})`} rx="8" />

        {variant === 'bottle' && (
          <>
            <ellipse cx="100" cy="186" rx="52" ry="7" fill="#00000010" />
            <rect x="78" y="102" width="44" height="84" rx="10" fill={`url(#body-${variant}-${product.id})`} />
            <rect x="78" y="102" width="10" height="84" rx="5" fill="#ffffff3d" />
            <rect x="88" y="118" width="24" height="44" rx="3" fill={label} opacity="0.94" />
            <rect x="92" y="124" width="16" height="3.5" rx="1.75" fill={accent} />
            <rect x="92" y="131" width="16" height="2.6" rx="1.3" fill={shade(accent, -20)} />
            <rect x="92" y="137" width="11" height="2.6" rx="1.3" fill={shade(accent, -20)} />
            <circle cx="88" cy="154" r="2.6" fill={accent} />
            <rect x="88" y="94" width="24" height="8" fill={`url(#cap-${product.id})`} />
            <rect x="90" y="76" width="20" height="18" rx="2" fill={`url(#cap-${product.id})`} />
            <rect x="90" y="76" width="6" height="18" fill="#ffffff2e" />
            <rect x="94" y="64" width="12" height="12" fill={shade(cap, -18)} />
          </>
        )}

        {variant === 'jar' && (
          <>
            <ellipse cx="100" cy="188" rx="56" ry="8" fill="#00000010" />
            <path
              d="M52 96 q0 -30 48 -30 q48 0 48 30 v72 q0 22 -48 22 q-48 0 -48 -22 z"
              fill={`url(#body-${variant}-${product.id})`}
            />
            <path d="M52 96 q0 -30 48 -30 q48 0 48 30 q0 22 -48 22 q-48 0 -48 -22 z" fill="#ffffff26" />
            <rect x="64" y="104" width="72" height="40" rx="4" fill={label} opacity="0.94" />
            <rect x="70" y="111" width="60" height="4" rx="2" fill={accent} />
            <rect x="70" y="119" width="52" height="3" rx="1.5" fill={shade(accent, -20)} />
            <rect x="70" y="127" width="44" height="3" rx="1.5" fill={shade(accent, -20)} />
            <rect x="52" y="52" width="96" height="44" rx="8" fill={`url(#cap-${product.id})`} />
            <rect x="52" y="52" width="96" height="10" rx="5" fill="#ffffff26" />
          </>
        )}

        {variant === 'tube' && (
          <>
            <ellipse cx="100" cy="186" rx="42" ry="7" fill="#00000010" />
            <path
              d="M70 172 l0 -92 q0 -14 14 -14 h12 q14 0 14 14 l0 92 q0 10 -10 10 h-20 q-10 0 -10 -10 z"
              fill={`url(#body-${variant}-${product.id})`}
            />
            <rect x="70" y="66" width="60" height="16" fill={`url(#accent-${product.id})`} />
            <rect x="70" y="66" width="60" height="5" fill="#ffffff33" />
            <rect x="78" y="98" width="44" height="38" rx="3" fill={label} opacity="0.94" />
            <rect x="82" y="104" width="36" height="4" rx="2" fill={accent} />
            <rect x="82" y="112" width="30" height="3" rx="1.5" fill={shade(accent, -20)} />
            <path d="M86 180 h28 l-4 0 h-20 z" fill={shade(c1, -16)} />
          </>
        )}
      </svg>
    </div>
  )
}
