import CollectionPage from './CollectionPage'
import { newArrivalProducts } from '../data/products'

export default function NewArrivalsPage() {
  return (
    <CollectionPage
      title="New Arrivals"
      subtitle="Fresh additions to the shop — recently added products ready to become your next skincare ritual."
      crumb="New Arrivals"
      items={newArrivalProducts}
    />
  )
}
