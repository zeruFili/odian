import CollectionPage from './CollectionPage'
import { newArrivalProducts } from '../data/products'

export default function NewArrivalsPage() {
  return (
    <CollectionPage
      title="Fresh Formulations & New Arrivals"
      subtitle="The latest breakthroughs in clinical skincare — newly launched products engineered to elevate your daily beauty ritual."
      crumb="New Arrivals"
      heroBadge="Newly Added to Catalog"
      accent="linear-gradient(135deg, #f4f6f8 0%, #e8eef2 100%)"
      items={newArrivalProducts}
    />
  )
}
