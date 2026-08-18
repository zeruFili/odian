import CollectionPage from './CollectionPage'
import { onSaleProducts } from '../data/products'

export default function DiscountPage() {
  return (
    <CollectionPage
      title="Discount"
      subtitle="Save on skincare favourites — limited-time offers with the original price and discounted price shown."
      crumb="Discount"
      accent="var(--color-pink-50)"
      items={onSaleProducts}
    />
  )
}
