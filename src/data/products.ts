export type ProductType = 'simple' | 'variable' | 'grouped' | 'external' | 'outofstock'
export type Currency = 'USD' | 'ETB'

export interface Product {
  id: string
  name: string
  category: string
  categories: string[]
  skinTypes: string[]
  price: number
  compareAtPrice?: number
  priceMax?: number
  rating: number
  reviews: number
  type: ProductType
  swatch: string
  swatch2?: string
  accents: string[]
  badge?: 'sale' | 'new' | 'bestseller'
  description: string
  /** Primary product photography */
  image?: string
  /** Additional gallery images for the product detail page */
  images?: string[]
  /** Currency of the listed price. Defaults to USD. */
  currency?: Currency
  brand?: string
  location?: string
}

export const ETB_PER_USD = 130

/** Formats a product price in its native currency. */
export function formatPrice(product: Product, value?: number, targetCurrency?: Currency): string {
  const effectiveCurrency = targetCurrency ?? product.currency ?? 'USD'
  const baseInUsd = priceInUsd(product, value)

  if (effectiveCurrency === 'ETB') {
    const etbAmount = targetCurrency === 'ETB' && product.currency !== 'ETB' 
      ? Math.round(baseInUsd * ETB_PER_USD) 
      : Math.round(value ?? product.price)
    return `ETB ${etbAmount.toLocaleString('en-US')}`
  }

  const usdAmount = targetCurrency === 'USD' && product.currency === 'ETB'
    ? baseInUsd
    : (value ?? product.price)
  return `$${usdAmount.toFixed(2)}`
}

/** Normalized price in USD, used for sorting and the price filter. */
export function priceInUsd(product: Product, overridePrice?: number): number {
  const price = overridePrice ?? product.price
  if ((product.currency ?? 'USD') === 'ETB') {
    return price / ETB_PER_USD
  }
  return price
}

export const CATEGORIES = [
  'Face Care',
  'Cleansers',
  'Eye Care',
  'Masks',
  'Serums',
  'Toners',
  'Body Care',
  'Exfoliants',
  'Moisturizers',
  'Oils',
  'Anti-pigmentation',
  'Hair Care',
  'Treatments',
  'Skincare Sets',
] as const

export const SKIN_TYPES = ['Combination', 'Dry', 'Sensitive', 'Normal', 'Oily'] as const

export const CATEGORY_TICKER = [
  'Night repair masks',
  'Gentle foam cleansers',
  'UVA/UVB sunscreens',
  'Hydra-glow mists',
  'Botanical body washes',
  'Retinol renewal treatments',
  'Collagen elasticity boosters',
  'Antioxidant vitamin C serums',
]

const rawProducts: Product[] = [
  {
    id: 'lumiere-radiance-serum',
    name: 'Radiance Renewal Serum',
    category: 'Serums',
    categories: ['Face Care', 'Serums'],
    skinTypes: ['Normal', 'Dry'],
    price: 80.5,
    compareAtPrice: 98,
    rating: 5,
    reviews: 18,
    type: 'simple',
    swatch: '#f3e3d7',
    swatch2: '#e8b48a',
    accents: ['#c98a5f', '#f6ede4', '#b3a596'],
    badge: 'bestseller',
    description: 'A brightening vitamin C serum enriched with ferulic acid and hyaluronic spheres for a luminous, deeply hydrated complexion.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1608248597359-338245781a8b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'antiseptic-body-wash',
    name: 'Purifying Body Wash',
    category: 'Body Care',
    categories: ['Body Care', 'Cleansers'],
    skinTypes: ['Normal', 'Oily'],
    price: 30,
    rating: 5,
    reviews: 14,
    type: 'simple',
    swatch: '#e7edf2',
    swatch2: '#b7cdd9',
    accents: ['#7fa3b5', '#eef4f7', '#5d7f8f'],
    description: 'A gentle antibacterial tea tree and eucalyptus wash that leaves skin thoroughly cleansed, calmed, and refreshed.',
    image: 'https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'charcoal-detox-cleanser',
    name: 'Charcoal Detox Cleanser',
    category: 'Cleansers',
    categories: ['Face Care', 'Cleansers'],
    skinTypes: ['Oily', 'Combination'],
    price: 28,
    compareAtPrice: 36,
    rating: 4,
    reviews: 22,
    type: 'simple',
    swatch: '#4a4a4a',
    swatch2: '#2c2c2c',
    accents: ['#202020', '#6b6b6b', '#141414'],
    badge: 'sale',
    description: 'Activated charcoal micro-formula draws out deep impurities, controls excess sebum, and minimizes congested pores.',
    image: 'https://images.unsplash.com/photo-1556228722-d0b5d0f81f44?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1556228722-d0b5d0f81f44?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'clarifying-aha-cleanser',
    name: 'Clarifying AHA Cleanser',
    category: 'Cleansers',
    categories: ['Face Care', 'Cleansers'],
    skinTypes: ['Combination', 'Normal'],
    price: 29,
    compareAtPrice: 36,
    rating: 4,
    reviews: 9,
    type: 'simple',
    swatch: '#f6e7d8',
    swatch2: '#eecfa8',
    accents: ['#d8a96b', '#faf1e6', '#c08a4d'],
    badge: 'sale',
    description: 'Alpha-hydroxy acids gently resurface micro-textures for renewed clarity, cellular turnover, and silky smooth tone.',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'coconut-oil-lotion',
    name: 'Coconut Silk Body Lotion',
    category: 'Moisturizers',
    categories: ['Body Care', 'Moisturizers'],
    skinTypes: ['Dry', 'Normal'],
    price: 10,
    compareAtPrice: 14,
    rating: 5,
    reviews: 31,
    type: 'outofstock',
    swatch: '#fdf6ee',
    swatch2: '#f0e2cf',
    accents: ['#e5c9a6', '#fbf3e8', '#cfa97e'],
    badge: 'sale',
    description: 'Whipped cold-pressed coconut hydration providing 24-hour nourishment for soft, supple, velvety skin.',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'collagen-face-cream',
    name: 'Collagen Renewal Cream',
    category: 'Moisturizers',
    categories: ['Face Care', 'Moisturizers'],
    skinTypes: ['Dry', 'Sensitive'],
    price: 14,
    compareAtPrice: 24,
    rating: 4,
    reviews: 16,
    type: 'simple',
    swatch: '#f3dede',
    swatch2: '#eac2c2',
    accents: ['#d69a9a', '#f8ebeb', '#bf7d7d'],
    badge: 'sale',
    description: 'Multi-peptide firming collagen cream that strengthens skin barrier resilience and restores youthful elasticity.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'cosmetic-firming-serum',
    name: 'Firming Botanical Serum',
    category: 'Serums',
    categories: ['Face Care', 'Serums', 'Anti-pigmentation'],
    skinTypes: ['Normal', 'Combination'],
    price: 32,
    priceMax: 80,
    rating: 4,
    reviews: 12,
    type: 'variable',
    swatch: '#e8efe4',
    swatch2: '#c4d6bc',
    accents: ['#93ab86', '#eef3ea', '#7a9370'],
    description: 'Potent botanical actives with centella and green tea extract visibly lift, sculpt, and firm facial contours.',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'exfoliating-body-scrub',
    name: 'Mineral Body Polish',
    category: 'Exfoliants',
    categories: ['Body Care', 'Exfoliants'],
    skinTypes: ['Normal', 'Dry'],
    price: 58,
    compareAtPrice: 72,
    rating: 5,
    reviews: 27,
    type: 'external',
    swatch: '#f0e0cd',
    swatch2: '#dcbf9b',
    accents: ['#c49a6b', '#f6ebdd', '#a97e4f'],
    badge: 'sale',
    description: 'Finely milled volcanic minerals, botanical oils, and sea salts gently buff away dullness for baby-soft, glowing skin.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'gentle-foaming-face-wash',
    name: 'Gentle Foam Cleanser',
    category: 'Cleansers',
    categories: ['Face Care', 'Cleansers'],
    skinTypes: ['Sensitive', 'Dry'],
    price: 38,
    compareAtPrice: 50,
    rating: 5,
    reviews: 43,
    type: 'simple',
    swatch: '#eef2f5',
    swatch2: '#d5e0e6',
    accents: ['#a9bcc8', '#f3f7f9', '#8aa1af'],
    badge: 'sale',
    description: 'A cloud-soft amino acid foam that melts sunscreen and impurities without stripping vital moisture lipids.',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'hydra-glow-mist',
    name: 'Hydra Glow Face Mist',
    category: 'Toners',
    categories: ['Face Care', 'Toners'],
    skinTypes: ['Dry', 'Normal'],
    price: 26,
    rating: 5,
    reviews: 19,
    type: 'simple',
    swatch: '#e3f0f1',
    swatch2: '#c2dfe0',
    accents: ['#8fc0c1', '#eef7f7', '#6fa8a9'],
    badge: 'new',
    description: 'A micro-fine dewy facial mist infused with glacier water and niacinamide for an instant surge of radiance.',
    image: 'https://images.unsplash.com/photo-1608248597359-338245781a8b?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1608248597359-338245781a8b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'rose-petal-toner',
    name: 'Rose Petal Toner',
    category: 'Toners',
    categories: ['Face Care', 'Toners'],
    skinTypes: ['Sensitive', 'Combination'],
    price: 24,
    compareAtPrice: 30,
    rating: 4,
    reviews: 35,
    type: 'simple',
    swatch: '#f7e4e8',
    swatch2: '#efc9d2',
    accents: ['#d69aa8', '#faf0f2', '#c17f90'],
    badge: 'sale',
    description: 'Steam-distilled organic rose damascena water tones, rebalances pH, and calms surface sensitivity instantly.',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1608248597359-338245781a8b?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'vitamin-c-booster',
    name: 'Vitamin C Glow Booster',
    category: 'Serums',
    categories: ['Face Care', 'Serums'],
    skinTypes: ['Normal', 'Oily'],
    price: 46,
    compareAtPrice: 58,
    rating: 5,
    reviews: 62,
    type: 'simple',
    swatch: '#fdf0d6',
    swatch2: '#f7d99a',
    accents: ['#e0a93f', '#fbf4e3', '#c98f2a'],
    badge: 'bestseller',
    description: 'Stabilized 20% L-ascorbic acid booster targets hyperpigmentation, protects against environmental stressors, and boosts collagen synthesis.',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'retinol-night-serum',
    name: 'Retinol Night Serum',
    category: 'Treatments',
    categories: ['Face Care', 'Treatments'],
    skinTypes: ['Normal', 'Combination'],
    price: 62,
    compareAtPrice: 78,
    rating: 5,
    reviews: 29,
    type: 'simple',
    swatch: '#efe6dd',
    swatch2: '#d9c4b2',
    accents: ['#a98a6d', '#f4ece3', '#8f6f53'],
    badge: 'sale',
    description: 'Micro-encapsulated pure retinol works with skin’s nightly repair cycle to smooth deep lines and accelerate cellular turnover.',
    image: 'https://images.unsplash.com/photo-1556228722-d0b5d0f81f44?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1556228722-d0b5d0f81f44?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'collagen-eye-gel',
    name: 'Collagen Eye Gel',
    category: 'Eye Care',
    categories: ['Face Care', 'Eye Care'],
    skinTypes: ['Sensitive', 'Normal'],
    price: 34,
    compareAtPrice: 42,
    rating: 4,
    reviews: 15,
    type: 'simple',
    swatch: '#e8f0ea',
    swatch2: '#cfe0d4',
    accents: ['#a3c0ab', '#eef5f0', '#8aa995'],
    badge: 'sale',
    description: 'Cooling peptide-infused gel with caffeine immediately de-puffs tired under-eyes and hydrates delicate skin tissue.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'night-repair-mask',
    name: 'Overnight Repair Mask',
    category: 'Masks',
    categories: ['Face Care', 'Masks'],
    skinTypes: ['Dry', 'Sensitive'],
    price: 42,
    compareAtPrice: 52,
    rating: 5,
    reviews: 38,
    type: 'simple',
    swatch: '#efe3f0',
    swatch2: '#dcc6df',
    accents: ['#b793bc', '#f5ecf6', '#a079a6'],
    badge: 'new',
    description: 'An intensive velvety leave-on sleeping mask that wraps skin in barrier-replenishing ceramides and moisture-locking squalane.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'hydrating-sheet-set',
    name: 'Hydration Mask Set',
    category: 'Skincare Sets',
    categories: ['Face Care', 'Masks', 'Skincare Sets'],
    skinTypes: ['Dry', 'Normal'],
    price: 55,
    priceMax: 68,
    rating: 5,
    reviews: 44,
    type: 'grouped',
    swatch: '#e6eff5',
    swatch2: '#c3d8e5',
    accents: ['#8fb4c9', '#eef5f9', '#7a9fb5'],
    badge: 'bestseller',
    description: 'A curated 5-piece box of biocellulose sheet masks soaked in concentrated hyaluronic acid, tremella mushroom, and panthenol.',
    image: 'https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1567928815116-2a8138908d01?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'hair-keratin-mask',
    name: 'Keratin Repair Hair Mask',
    category: 'Hair Care',
    categories: ['Hair Care', 'Treatments'],
    skinTypes: ['Normal', 'Dry'],
    price: 36,
    compareAtPrice: 46,
    rating: 4,
    reviews: 19,
    type: 'simple',
    swatch: '#f0e4d4',
    swatch2: '#e0c9ab',
    accents: ['#c39a6b', '#f6eddf', '#a87f51'],
    badge: 'sale',
    description: 'Hydrolyzed biomimetic keratin restores damaged cuticles, reinforces hair cortex strength, and imparts mirror-like shine.',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'argan-hair-oil',
    name: 'Argan Shine Hair Oil',
    category: 'Hair Care',
    categories: ['Hair Care', 'Oils'],
    skinTypes: ['Normal', 'Dry'],
    price: 40,
    compareAtPrice: 50,
    rating: 5,
    reviews: 51,
    type: 'simple',
    swatch: '#f6e9cf',
    swatch2: '#eccf9c',
    accents: ['#d2a75a', '#faf1e0', '#b8893f'],
    badge: 'bestseller',
    description: 'Virgin cold-pressed Moroccan argan oil calms flyaways, seals split ends, and delivers weightless gloss with thermal defense.',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'shea-body-butter',
    name: 'Shea Whipped Body Butter',
    category: 'Moisturizers',
    categories: ['Body Care', 'Moisturizers'],
    skinTypes: ['Dry', 'Sensitive'],
    price: 22,
    compareAtPrice: 28,
    rating: 4,
    reviews: 26,
    type: 'simple',
    swatch: '#f7eede',
    swatch2: '#edd8c0',
    accents: ['#d2ab85', '#f9f2e9', '#b98d63'],
    badge: 'sale',
    description: 'Artisanal unrefined shea butter whipped with jojoba and almond oils to instantly soothe dry, flakey skin.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'squalane-face-oil',
    name: 'Squalane Glow Face Oil',
    category: 'Oils',
    categories: ['Face Care', 'Oils'],
    skinTypes: ['Dry', 'Normal'],
    price: 48,
    compareAtPrice: 60,
    rating: 5,
    reviews: 67,
    type: 'simple',
    swatch: '#f8efdc',
    swatch2: '#ecd9a8',
    accents: ['#d8b264', '#faf4e7', '#c0964a'],
    badge: 'bestseller',
    description: '100% plant-derived sugarcane squalane locks in deep hydration, improves skin elasticity, and produces a glass-skin finish.',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'sunscreen-spf50',
    name: 'Daily Defense SPF 50',
    category: 'Treatments',
    categories: ['Face Care', 'Treatments'],
    skinTypes: ['Normal', 'Combination'],
    price: 32,
    compareAtPrice: 40,
    rating: 4,
    reviews: 41,
    type: 'simple',
    swatch: '#f2f1ed',
    swatch2: '#e0dfd8',
    accents: ['#b8b6ac', '#f6f5f2', '#9c9a90'],
    badge: 'sale',
    description: 'Invisible broad-spectrum SPF 50+ sunscreen that leaves zero white cast, absorbs cleanly, and wears perfectly under makeup.',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'retinol-cream',
    name: 'Retinol Renewal Cream',
    category: 'Treatments',
    categories: ['Face Care', 'Treatments', 'Moisturizers'],
    skinTypes: ['Normal', 'Dry'],
    price: 54,
    compareAtPrice: 68,
    rating: 4,
    reviews: 23,
    type: 'simple',
    swatch: '#f0e8df',
    swatch2: '#ddcdbd',
    accents: ['#b19a80', '#f5efe8', '#977f64'],
    badge: 'sale',
    description: 'Rich night cream featuring slow-release retinol and bakuchiol to gently diminish wrinkles while deeply conditioning skin.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'clay-purify-mask',
    name: 'Green Clay Purify Mask',
    category: 'Masks',
    categories: ['Face Care', 'Masks'],
    skinTypes: ['Oily', 'Combination'],
    price: 30,
    compareAtPrice: 38,
    rating: 4,
    reviews: 18,
    type: 'simple',
    swatch: '#dfe8d8',
    swatch2: '#c3d2b7',
    accents: ['#93a887', '#edf3e9', '#7c9371'],
    badge: 'sale',
    description: 'French Montmorillonite green clay and spirulina decongest oily pores, regulate sebum, and detoxify without overdrying.',
    image: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'hyaluronic-toner',
    name: 'Hyaluronic Toning Essence',
    category: 'Toners',
    categories: ['Face Care', 'Toners'],
    skinTypes: ['Dry', 'Sensitive'],
    price: 27,
    compareAtPrice: 34,
    rating: 5,
    reviews: 49,
    type: 'simple',
    swatch: '#e6f1f3',
    swatch2: '#c9e2e6',
    accents: ['#9cc3c9', '#eef7f8', '#83aeb5'],
    badge: 'new',
    description: 'Triple-weight molecular hyaluronic acid essence plumps the epidermis and preps skin to absorb active serums deeper.',
    image: 'https://images.unsplash.com/photo-1608248597359-338245781a8b?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1608248597359-338245781a8b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'brightening-eye-cream',
    name: 'Brightening Eye Cream',
    category: 'Eye Care',
    categories: ['Face Care', 'Eye Care'],
    skinTypes: ['Sensitive', 'Dry'],
    price: 39,
    compareAtPrice: 49,
    rating: 4,
    reviews: 21,
    type: 'simple',
    swatch: '#f5e8e8',
    swatch2: '#e9cfcf',
    accents: ['#c99a9a', '#f8efef', '#b07f7f'],
    badge: 'sale',
    description: 'Niacinamide, pearl extract, and squalane visibly brighten dark circles while smoothing fine expression lines.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'overnight-oil-treatment',
    name: 'Overnight Repair Oil',
    category: 'Oils',
    categories: ['Face Care', 'Oils', 'Treatments'],
    skinTypes: ['Dry', 'Normal'],
    price: 58,
    compareAtPrice: 72,
    rating: 5,
    reviews: 33,
    type: 'simple',
    swatch: '#f2e4c8',
    swatch2: '#e4c892',
    accents: ['#c49a4d', '#f7eed8', '#a87f39'],
    badge: 'bestseller',
    description: 'An elixir of rosehip seed, evening primrose, and marula oils providing essential omega fatty acids for overnight restoration.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'sugar-body-scrub',
    name: 'Sugar Citrus Body Scrub',
    category: 'Exfoliants',
    categories: ['Body Care', 'Exfoliants'],
    skinTypes: ['Normal', 'Oily'],
    price: 34,
    compareAtPrice: 42,
    rating: 4,
    reviews: 17,
    type: 'simple',
    swatch: '#f8ead2',
    swatch2: '#efd4a4',
    accents: ['#d8a855', '#fbf2e2', '#c08b3d'],
    badge: 'sale',
    description: 'Fine organic cane sugar crystals blended with cold-pressed sweet orange and grapefruit oils polish and invigorate skin.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'anti-pigmentation-serum',
    name: 'Even Tone Correcting Serum',
    category: 'Anti-pigmentation',
    categories: ['Face Care', 'Anti-pigmentation', 'Serums'],
    skinTypes: ['Normal', 'Combination'],
    price: 72,
    compareAtPrice: 90,
    rating: 5,
    reviews: 58,
    type: 'simple',
    swatch: '#f3e9dd',
    swatch2: '#e5cdb2',
    accents: ['#c19a6f', '#f7f0e6', '#a67f55'],
    badge: 'bestseller',
    description: 'Alpha arbutin, tranexamic acid, and licorice root target stubborn sun damage and post-blemish dark marks for an even glow.',
    image: 'https://images.unsplash.com/photo-1608248597359-338245781a8b?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1608248597359-338245781a8b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'gentle-milk-cleanser',
    name: 'Creamy Milk Cleanser',
    category: 'Cleansers',
    categories: ['Face Care', 'Cleansers'],
    skinTypes: ['Sensitive', 'Dry'],
    price: 25,
    compareAtPrice: 31,
    rating: 4,
    reviews: 20,
    type: 'simple',
    swatch: '#f8f3ec',
    swatch2: '#eee2d2',
    accents: ['#d4b893', '#faf6f0', '#bd9c72'],
    badge: 'sale',
    description: 'A comforting, non-foaming emulsion with oat milk and chamomile that dissolves makeup while respecting sensitive skin barriers.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85'
    ],
  },
  {
    id: 'skincare-essentials-set',
    name: 'Daily Essentials Skincare Set',
    category: 'Skincare Sets',
    categories: ['Face Care', 'Skincare Sets'],
    skinTypes: ['Normal', 'Dry'],
    price: 120,
    priceMax: 140,
    rating: 5,
    reviews: 74,
    type: 'grouped',
    swatch: '#f0eae4',
    swatch2: '#ddd0c3',
    accents: ['#b49c86', '#f5f0ea', '#9a816b'],
    badge: 'bestseller',
    description: 'The definitive 4-step ritual: Gentle Cleanser, Hydrating Essence, Radiance Serum, and Barrier Recovery Cream.',
    image: 'https://images.unsplash.com/photo-1567928815116-2a8138908d01?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1567928815116-2a8138908d01?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?auto=format&fit=crop&w=900&q=85'
    ],
  },

  // ============================================================
  // Reference listings sourced from Jiji Ethiopia (jiji.com.et)
  // ============================================================

  // Cleansers
  {
    id: 'jiji-cetaphil-daily-cleanser',
    name: 'Cetaphil Daily Facial Cleanser',
    category: 'Cleansers',
    categories: ['Face Care', 'Cleansers'],
    skinTypes: ['Normal', 'Oily'],
    price: 3100,
    rating: 4,
    reviews: 13,
    type: 'simple',
    swatch: '#e8f0f4',
    swatch2: '#c4d8e2',
    accents: ['#2e6d8c', '#ffffff', '#1f4f68'],
    description: 'Original Cetaphil face cleanser for normal to oily skin, 236 ml. Deep cleanses without stripping moisture.',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'Cetaphil',
    location: 'Addis Ababa, Bole',
  },
  {
    id: 'jiji-cerave-hydrating-cleanser',
    name: 'CeraVe Hydrating Cleanser',
    category: 'Cleansers',
    categories: ['Face Care', 'Cleansers'],
    skinTypes: ['Dry', 'Sensitive'],
    price: 4600,
    rating: 5,
    reviews: 28,
    type: 'simple',
    swatch: '#e6f0ea',
    swatch2: '#c5dccb',
    accents: ['#1f7a4d', '#ffffff', '#165a39'],
    badge: 'bestseller',
    description: 'Original CeraVe Hydrating Cleanser from the USA with ceramides and hyaluronic acid — gentle, non-foaming, fragrance-free.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'CeraVe',
    location: 'Addis Ababa, Yeka',
  },
  {
    id: 'jiji-panoxyl-foaming-wash',
    name: 'PanOxyl Acne Foaming Wash',
    category: 'Cleansers',
    categories: ['Face Care', 'Cleansers', 'Treatments'],
    skinTypes: ['Oily', 'Combination'],
    price: 2900,
    rating: 4,
    reviews: 16,
    type: 'simple',
    swatch: '#eef2f5',
    swatch2: '#d3dde3',
    accents: ['#0077b6', '#ffffff', '#005a8c'],
    description: '10% Maximum Strength Benzoyl Peroxide acne wash treatment for stubborn breakouts and clogged pores.',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1556228722-d0b5d0f81f44?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'PanOxyl',
    location: 'Addis Ababa, Bole',
  },

  // Serums
  {
    id: 'jiji-cosrx-niacinamide-serum',
    name: 'COSRX Niacinamide 15% Face Serum',
    category: 'Serums',
    categories: ['Face Care', 'Serums'],
    skinTypes: ['Normal', 'Oily'],
    price: 4000,
    compareAtPrice: 4800,
    badge: 'new',
    rating: 5,
    reviews: 32,
    type: 'simple',
    swatch: '#f6efe4',
    swatch2: '#e6d6bc',
    accents: ['#c89f5e', '#ffffff', '#a67f3f'],
    description: 'COSRX The Niacinamide 15% Face Serum with Zinc PCA — a powerful clinical solution to tighten pores and regulate oil.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'COSRX',
    location: 'Addis Ababa, Bole',
  },
  {
    id: 'jiji-naturium-niacinamide-serum',
    name: 'Naturium Niacinamide Serum 12%',
    category: 'Serums',
    categories: ['Face Care', 'Serums'],
    skinTypes: ['Normal', 'Combination'],
    price: 7500,
    compareAtPrice: 8800,
    badge: 'new',
    rating: 4,
    reviews: 19,
    type: 'simple',
    swatch: '#f4efe9',
    swatch2: '#e0d6c9',
    accents: ['#8a6f52', '#ffffff', '#6b5340'],
    description: 'Naturium Niacinamide 12% Plus Zinc 2% — clinically formulated to diminish dark spots, enlarged pores, and uneven tone.',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'Naturium',
    location: 'Addis Ababa, Bole',
  },
  {
    id: 'jiji-lrp-vitamin-c-serum',
    name: 'La Roche-Posay Vitamin C Face Serum',
    category: 'Serums',
    categories: ['Face Care', 'Serums'],
    skinTypes: ['Normal', 'Dry'],
    price: 6000,
    compareAtPrice: 7200,
    badge: 'bestseller',
    rating: 5,
    reviews: 47,
    type: 'simple',
    swatch: '#f6e9dc',
    swatch2: '#ecd2b4',
    accents: ['#d98e3f', '#ffffff', '#b56f28'],
    description: 'Pure 10% Vitamin C Serum with salicylic acid and neurosensine for sensitive skin — anti-aging, smoothing, and radiant.',
    image: 'https://images.unsplash.com/photo-1608248597359-338245781a8b?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1608248597359-338245781a8b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'La Roche-Posay',
    location: 'Addis Ababa, Bole',
  },
  {
    id: 'jiji-eucerin-anti-pigment-serum',
    name: 'Eucerin Anti-Pigment Dual Serum',
    category: 'Anti-pigmentation',
    categories: ['Face Care', 'Serums', 'Anti-pigmentation'],
    skinTypes: ['Normal', 'Combination'],
    price: 8000,
    compareAtPrice: 9600,
    badge: 'new',
    rating: 5,
    reviews: 35,
    type: 'simple',
    swatch: '#f5efe7',
    swatch2: '#e4d9c9',
    accents: ['#b04a5a', '#ffffff', '#8a3745'],
    description: 'Eucerin Anti-Pigment Dual Serum with patented Thiamidol and concentrated hyaluronic acid — fades dark spots in 2 weeks.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'Eucerin',
    location: 'Addis Ababa, Nifas Silk-Lafto',
  },

  // Masks
  {
    id: 'jiji-charcoal-peel-off-mask',
    name: 'Charcoal Black Peel-Off Mask',
    category: 'Masks',
    categories: ['Face Care', 'Masks'],
    skinTypes: ['Oily', 'Combination'],
    price: 1200,
    rating: 4,
    reviews: 14,
    type: 'simple',
    swatch: '#3a3a3a',
    swatch2: '#222222',
    accents: ['#000000', '#ffffff', '#0a0a0a'],
    description: 'Purifying black charcoal peel-off face mask — pulls out blackheads and dead surface cells, 300 g.',
    image: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1556228722-d0b5d0f81f44?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'Unbranded',
    location: 'Addis Ababa, Bole',
  },
  {
    id: 'jiji-bamboo-charcoal-mask',
    name: 'Bamboo Charcoal Deep Cleansing Mask',
    category: 'Masks',
    categories: ['Face Care', 'Masks'],
    skinTypes: ['Oily', 'Normal'],
    price: 2000,
    rating: 4,
    reviews: 11,
    type: 'simple',
    swatch: '#2f2f2f',
    swatch2: '#1b1b1b',
    accents: ['#0c0c0c', '#ffffff', '#000000'],
    description: 'YC Black Mask with organic bamboo charcoal — an intensive deep-cleansing ritual for a refined, clearer complexion.',
    image: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'YC',
    location: 'Addis Ababa, Kirkos',
  },
  {
    id: 'jiji-balea-peel-off-mask',
    name: 'Balea Peel-Off Face Mask',
    category: 'Masks',
    categories: ['Face Care', 'Masks'],
    skinTypes: ['Normal', 'Combination'],
    price: 1299,
    rating: 4,
    reviews: 8,
    type: 'simple',
    swatch: '#e8f0ee',
    swatch2: '#c9dcda',
    accents: ['#2f9e8f', '#ffffff', '#237a6e'],
    description: 'Balea Peel-Off Mask with thermal water and witch hazel removes dirt, sebum, and dead skin cells gently.',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'Balea',
    location: 'Addis Ababa, Arada',
  },

  // Eye Care
  {
    id: 'jiji-beauty-of-joseon-eye-cream',
    name: 'Beauty of Joseon Eye Cream',
    category: 'Eye Care',
    categories: ['Face Care', 'Eye Care'],
    skinTypes: ['Dry', 'Normal'],
    price: 3150,
    rating: 5,
    reviews: 64,
    type: 'simple',
    swatch: '#f4ede2',
    swatch2: '#e2d3bd',
    accents: ['#a9814f', '#ffffff', '#8a653a'],
    badge: 'bestseller',
    description: 'Revive Eye Serum with Ginseng and Retinal — deeply hydrates delicate orbital skin while smoothing crow’s feet.',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'Beauty of Joseon',
    location: 'Addis Ababa, Addis Ketema',
  },
  {
    id: 'jiji-cerave-eye-repair-cream',
    name: 'CeraVe Eye Repair Cream',
    category: 'Eye Care',
    categories: ['Face Care', 'Eye Care'],
    skinTypes: ['Sensitive', 'Dry'],
    price: 4000,
    rating: 4,
    reviews: 24,
    type: 'simple',
    swatch: '#eef2f0',
    swatch2: '#d2ddd9',
    accents: ['#1f6b52', '#ffffff', '#174f3d'],
    description: 'Original CeraVe Eye Repair Cream with marine botanicals and essential ceramides helps diminish dark circles and puffiness.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'CeraVe',
    location: 'Addis Ababa, Bole',
  },
  {
    id: 'jiji-inkey-list-retinol-eye-cream',
    name: 'The Inkey List Retinol Eye Cream',
    category: 'Eye Care',
    categories: ['Face Care', 'Eye Care', 'Treatments'],
    skinTypes: ['Normal', 'Combination'],
    price: 4950,
    rating: 4,
    reviews: 17,
    type: 'simple',
    swatch: '#f2ede4',
    swatch2: '#e0d4c0',
    accents: ['#9c8a5e', '#ffffff', '#7a6a45'],
    description: 'The Inkey List Retinol Eye Cream — an overnight slow-release 3% Vitalease retinol complex engineered for the eye area.',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'The Inkey List',
    location: 'Addis Ababa, Bole',
  },

  // Toners
  {
    id: 'jiji-ordinary-glycolic-toner',
    name: 'The Ordinary Glycolic Acid 7% Toner',
    category: 'Toners',
    categories: ['Face Care', 'Toners'],
    skinTypes: ['Combination', 'Normal'],
    price: 4500,
    compareAtPrice: 5400,
    badge: 'bestseller',
    rating: 5,
    reviews: 83,
    type: 'simple',
    swatch: '#f3ede2',
    swatch2: '#e0d3bc',
    accents: ['#b08a55', '#ffffff', '#8f6d3f'],
    description: 'The Ordinary Glycolic Acid 7% Exfoliating Toner — chemically exfoliates dead surface cells to unveil smooth clarity.',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1608248597359-338245781a8b?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'The Ordinary',
    location: 'Addis Ababa, Arada',
  },

  // Moisturizers
  {
    id: 'jiji-cetaphil-moisturizing-lotion',
    name: 'Cetaphil Moisturizing Lotion',
    category: 'Moisturizers',
    categories: ['Body Care', 'Moisturizers'],
    skinTypes: ['Dry', 'Sensitive'],
    price: 5500,
    compareAtPrice: 6500,
    rating: 5,
    reviews: 39,
    type: 'simple',
    swatch: '#e6f0f2',
    swatch2: '#c2d9de',
    accents: ['#1f6f8a', '#ffffff', '#175468'],
    badge: 'sale',
    description: 'Dermatologist-recommended lightweight daily moisturizing lotion enriched with vitamin E and pro-vitamin B5.',
    image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'Cetaphil',
    location: 'Addis Ababa, Bole',
  },
  {
    id: 'jiji-cerave-daily-lotion',
    name: 'CeraVe Daily Moisturizing Lotion',
    category: 'Moisturizers',
    categories: ['Body Care', 'Moisturizers'],
    skinTypes: ['Normal', 'Dry'],
    price: 6500,
    compareAtPrice: 7800,
    badge: 'bestseller',
    rating: 5,
    reviews: 95,
    type: 'simple',
    swatch: '#e8f0ea',
    swatch2: '#c9dcce',
    accents: ['#1f7a4d', '#ffffff', '#165a39'],
    description: 'CeraVe Daily Moisturizing Lotion 591 ml with MVE delivery technology, 3 essential ceramides, and hyaluronic acid.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'CeraVe',
    location: 'Addis Ababa, Bole',
  },
  {
    id: 'jiji-nuba-shea-butter',
    name: 'Nuba Organic Shea Butter',
    category: 'Moisturizers',
    categories: ['Body Care', 'Moisturizers', 'Oils'],
    skinTypes: ['Dry', 'Sensitive'],
    price: 2600,
    rating: 4,
    reviews: 18,
    type: 'simple',
    swatch: '#f7efe0',
    swatch2: '#ecdcc2',
    accents: ['#d6a96a', '#ffffff', '#b88a4a'],
    description: '100% pure organic grade-A golden shea butter — deeply heals extreme dryness, cracked heels, and eczema patches.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'Nuba',
    location: 'Addis Ababa, Bole',
  },

  // Exfoliants
  {
    id: 'jiji-fruit-of-wokali-scrub',
    name: 'Fruit of the Wokali Scrub',
    category: 'Exfoliants',
    categories: ['Body Care', 'Exfoliants'],
    skinTypes: ['Normal', 'Dry'],
    price: 1350,
    rating: 4,
    reviews: 12,
    type: 'simple',
    swatch: '#f8ecda',
    swatch2: '#ecd2ab',
    accents: ['#e08a3a', '#ffffff', '#b86a28'],
    description: 'Fruit of the Wokali Sherbet Body Scrub with crushed walnut shells and fruit extracts for silky soft exfoliation.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'Fruit of the Wokali',
    location: 'Addis Ababa, Kolfe Keranio',
  },

  // Oils
  {
    id: 'jiji-odourless-coconut-oil',
    name: 'Odourless Coconut Oil',
    category: 'Oils',
    categories: ['Body Care', 'Oils', 'Hair Care'],
    skinTypes: ['Dry', 'Normal'],
    price: 4000,
    rating: 4,
    reviews: 15,
    type: 'simple',
    swatch: '#fdf9f1',
    swatch2: '#f0e6d3',
    accents: ['#d8b98a', '#ffffff', '#b8965f'],
    description: 'Pure fractionated odourless coconut oil imported from South Africa — non-greasy carrier oil for head-to-toe beauty routines.',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'Unbranded',
    location: 'Addis Ababa, Bole',
  },

  // Treatments (sunscreen)
  {
    id: 'jiji-skin1004-centella-sunscreen',
    name: 'SKIN1004 Centella Sun Serum',
    category: 'Treatments',
    categories: ['Face Care', 'Treatments'],
    skinTypes: ['Sensitive', 'Normal'],
    price: 3800,
    compareAtPrice: 4600,
    badge: 'bestseller',
    rating: 5,
    reviews: 53,
    type: 'simple',
    swatch: '#eef4ef',
    swatch2: '#d2e3d6',
    accents: ['#3f8f5f', '#ffffff', '#2f6f48'],
    description: 'SKIN1004 Madagascar Centella Hyalu-Cica Water-Fit Sun Serum SPF 50+ PA++++ — ultra-hydrating, zero white cast.',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'SKIN1004',
    location: 'Addis Ababa, Yeka',
  },
  {
    id: 'jiji-lrp-anthelios-spf50',
    name: 'La Roche-Posay Anthelios SPF 50+',
    category: 'Treatments',
    categories: ['Face Care', 'Treatments'],
    skinTypes: ['Oily', 'Normal'],
    price: 5500,
    compareAtPrice: 6600,
    badge: 'bestseller',
    rating: 5,
    reviews: 71,
    type: 'simple',
    swatch: '#f4efe8',
    swatch2: '#e3d9c9',
    accents: ['#c86a2a', '#ffffff', '#a5541f'],
    description: 'La Roche-Posay Anthelios UVMune 400 Invisible Fluid SPF 50+ — ultra-high UVA/UVB shield resistant to water and sweat.',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'La Roche-Posay',
    location: 'Addis Ababa, Bole',
  },

  // Hair Care
  {
    id: 'jiji-kirkland-minoxidil',
    name: 'Kirkland Minoxidil 5%',
    category: 'Hair Care',
    categories: ['Hair Care', 'Treatments'],
    skinTypes: ['Normal'],
    price: 1350,
    compareAtPrice: 1600,
    badge: 'sale',
    rating: 4,
    reviews: 37,
    type: 'simple',
    swatch: '#eef2f4',
    swatch2: '#d0dbe0',
    accents: ['#1f6f8a', '#ffffff', '#175468'],
    description: 'Original Kirkland Signature Minoxidil 5% topical solution from the USA — clinically proven treatment for hair regrowth.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'Kirkland',
    location: 'Addis Ababa, Bole',
  },
  {
    id: 'jiji-alecrim-hair-oil',
    name: 'Alecrim Rosemary Hair Oil',
    category: 'Hair Care',
    categories: ['Hair Care', 'Oils'],
    skinTypes: ['Normal', 'Dry'],
    price: 2000,
    badge: 'new',
    rating: 4,
    reviews: 21,
    type: 'simple',
    swatch: '#f2eddf',
    swatch2: '#e0d5bb',
    accents: ['#8a9a4f', '#ffffff', '#6b7a3a'],
    description: 'Alecrim (organic rosemary) scalp infusion oil — stimulates hair follicle circulation and strengthens weak strands.',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'Alecrim',
    location: 'Addis Ababa, Bole',
  },

  // Body Care (soap)
  {
    id: 'jiji-turmeric-kojic-soap',
    name: 'Turmeric & Kojic Soap',
    category: 'Body Care',
    categories: ['Body Care', 'Cleansers'],
    skinTypes: ['Oily', 'Combination'],
    price: 2000,
    badge: 'bestseller',
    rating: 4,
    reviews: 42,
    type: 'simple',
    swatch: '#f6e9d0',
    swatch2: '#ecd2a0',
    accents: ['#e0a030', '#ffffff', '#b87e20'],
    description: 'Natural organic Turmeric and Kojic Acid botanical bar — brightens hyperpigmentation and clears blemishes naturally.',
    image: 'https://images.unsplash.com/photo-1607006314647-49339a957863?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1607006314647-49339a957863?auto=format&fit=crop&w=900&q=85'
    ],
    currency: 'ETB',
    brand: 'Unbranded',
    location: 'Addis Ababa, Bole',
  },
]

/** Rewrites root-absolute asset paths so they work under any deployment base. */
function resolveAsset(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path
  }
  const base = import.meta.env.BASE_URL
  return path.startsWith('/') ? base + path.slice(1) : path
}

export const products: Product[] = (() => {
  const original = rawProducts.filter((p) => !p.id.startsWith('jiji-'))
  const jiji = rawProducts.filter((p) => p.id.startsWith('jiji-'))
  const result: Product[] = []
  let oi = 0
  let ji = 0
  while (oi < original.length || ji < jiji.length) {
    if (oi < original.length) result.push(original[oi++])
    if (ji < jiji.length) result.push(jiji[ji++])
  }
  return result.map((p) => ({
    ...p,
    image: p.image ? resolveAsset(p.image) : undefined,
    images: p.images?.map(resolveAsset),
  }))
})()

/** Products currently on sale (has an original/compare-at price). */
export const onSaleProducts: Product[] = products.filter((p) => p.compareAtPrice != null)

/** Recently added / new-arrival products (flagged new or recently sourced). */
export const newArrivalProducts: Product[] = products.filter(
  (p) => p.badge === 'new' || p.id.startsWith('jiji-'),
)
