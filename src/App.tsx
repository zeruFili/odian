import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from './store/cart'
import { MobileFiltersProvider } from './store/filters'
import Header from './components/Header'
import ShopPage from './components/ShopPage'
import ProductDetailPage from './components/ProductDetailPage'
import DiscountPage from './components/DiscountPage'
import NewArrivalsPage from './components/NewArrivalsPage'
import CartDrawer from './components/CartDrawer'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <CartProvider>
      <MobileFiltersProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<ShopPage />} />
              <Route path="/discount" element={<DiscountPage />} />
              <Route path="/new-arrivals" element={<NewArrivalsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
            </Routes>
          </main>
          <CartDrawer />
        </BrowserRouter>
      </MobileFiltersProvider>
    </CartProvider>
  )
}
