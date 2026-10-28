import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { CartProvider } from "./store/cart";
import { WishlistProvider } from "./store/wishlist";
import { CurrencyProvider } from "./store/currency";
import { ToastProvider } from "./store/toast";
import { MobileFiltersProvider } from "./store/filters";
import Header from "./components/Header";
import ShopPage from "./components/ShopPage";
import ProductDetailPage from "./components/ProductDetailPage";
import DiscountPage from "./components/DiscountPage";
import NewArrivalsPage from "./components/NewArrivalsPage";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import ToastContainer from "./components/ToastContainer";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <CurrencyProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <MobileFiltersProvider>
              <BrowserRouter basename={import.meta.env.BASE_URL}>
                <div className="min-h-screen bg-[#f8faf7] text-[#18352b] flex flex-col font-sans antialiased">
                  <ScrollToTop />

                  {/* Modern Navigation Header */}
                  <Header />

                  {/* Main E-Commerce Content Area */}
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<ShopPage />} />
                      <Route path="/discount" element={<DiscountPage />} />
                      <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                    </Routes>
                  </main>

                  {/* Drawers & Modals */}
                  <CartDrawer />
                  <WishlistDrawer />
                  <ToastContainer />
                </div>
              </BrowserRouter>
            </MobileFiltersProvider>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </CurrencyProvider>
  );
}
