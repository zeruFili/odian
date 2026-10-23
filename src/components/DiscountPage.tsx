import CollectionPage from './CollectionPage'
import { onSaleProducts } from '../data/products'

export default function DiscountPage() {
  return (
    <CollectionPage
      title="Promotions & Limited Offers"
      subtitle="Exclusive savings on clinical skincare favourites — each product clearly displays its original price, discount percentage, and current offer."
      crumb="Discounts"
      heroBadge="Limited Time Savings"
      accent="linear-gradient(135deg, #fdf4f0 0%, #f7e6dc 100%)"
      items={onSaleProducts}
    />
  )
}
