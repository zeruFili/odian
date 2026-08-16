import { CartProvider } from './store/cart'
import Header from './components/Header'
import ShopPage from './components/ShopPage'
import CartDrawer from './components/CartDrawer'

export default function App() {
  return (
    <CartProvider>
      <Header />
      <main>
        <ShopPage />
      </main>
      <CartDrawer />
    </CartProvider>
  )
}
