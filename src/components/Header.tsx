import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../store/cart";
import { useWishlist } from "../store/wishlist";
import { useCurrency } from "../store/currency";
import { products, type Product } from "../data/products";
import Icon, { BagIcon, HeartIcon, SearchIcon, CloseIcon, ChevronDownIcon } from "./Icons";
import ProductImage from "./ProductImage";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-display font-black text-xs sm:text-base flex items-center justify-center shadow-md group-hover:scale-105 transition-transform ${
          light ? "bg-amber-400 text-emerald-950" : "bg-[#123d32] text-amber-400"
        }`}
      >
        OD
      </div>
      <div>
        <span
          className={`font-display font-black text-base sm:text-xl tracking-tight block leading-tight ${
            light ? "text-white" : "text-gray-950"
          }`}
        >
          ODILIA
        </span>
        <span
          className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest hidden min-[380px]:block ${
            light ? "text-emerald-200/80" : "text-emerald-800"
          }`}
        >
          Botanical Skincare & Science
        </span>
      </div>
    </Link>
  );
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count: cartCount, openCart } = useCart();
  const { count: wishlistCount, openWishlist } = useWishlist();
  const { currency, setCurrency } = useCurrency();

  const [scrolledPast, setScrolledPast] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const staticSearchInputRef = useRef<HTMLInputElement>(null);
  const floatingSearchInputRef = useRef<HTMLInputElement>(null);

  // Close search & menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Scroll listener: smoothly slide in the navigation bar when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerWidth >= 640 ? 110 : 90;
      setScrolledPast(scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => {
        if (scrolledPast && floatingSearchInputRef.current) {
          floatingSearchInputRef.current.focus();
        } else if (staticSearchInputRef.current) {
          staticSearchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [searchOpen, scrolledPast]);

  // Filter search results
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const navLinks = [
    { label: "Shop Catalog", path: "/" },
    { label: "New Arrivals", path: "/new-arrivals" },
    { label: "Deals & Specials", path: "/discount" },
  ];

  const featuredCategories = [
    { name: "Serums & Boosters", path: "/?category=Serums", count: "12 Items" },
    { name: "Face Creams & Balms", path: "/?category=Face+Care", count: "9 Items" },
    { name: "Sunscreens & SPF 50", path: "/?category=Treatments", count: "6 Items" },
    { name: "Cleansers & Toners", path: "/?category=Cleansers", count: "8 Items" },
  ];

  const renderHeaderContent = (isFloating: boolean) => (
    <>
      <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <Logo />

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold tracking-tight transition-colors py-1 border-b-2 ${
                  isActive
                    ? "text-[#123d32] border-[#123d32]"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 sm:p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
            title="Search formulations"
            aria-label="Search"
          >
            <SearchIcon size={17} />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={openWishlist}
            className="p-2 sm:p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 relative transition-colors cursor-pointer"
            title="Saved Formulations Wishlist"
            aria-label="Wishlist"
          >
            <HeartIcon size={17} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-rose-600 text-white font-black text-[9px] sm:text-[10px] flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Button (Doqa Style) */}
          <button
            onClick={openCart}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-[#123d32] text-white rounded-xl text-xs font-bold hover:bg-[#1a4a3e] transition-all shadow-sm relative group shrink-0 active:scale-98 cursor-pointer"
            title="View Shopping Bag"
          >
            <BagIcon size={16} className="text-amber-400" />
            <span className="hidden sm:inline">Shopping Bag</span>
            {cartCount > 0 && (
              <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-black text-[11px] sm:text-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <CloseIcon size={20} /> : <Icon name="menu" size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Navigation Links: Directly accessible on mobile */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden border-t border-gray-100/90 bg-white/95 px-3 py-1.5 flex items-center justify-between gap-1.5"
      >
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex-1 text-center py-1.5 px-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-98 ${
                isActive
                  ? "bg-[#123d32] text-amber-300 shadow-2xs"
                  : "text-gray-700 hover:text-emerald-950 hover:bg-gray-100/70"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  const renderSearchDrawer = (isFloating: boolean) => {
    if (!searchOpen) return null;
    return (
      <div className="border-t border-gray-200 bg-white px-4 sm:px-8 py-3.5 shadow-md animate-fade-in">
        <div className="max-w-[1600px] mx-auto space-y-3">
          <div className="relative">
            <SearchIcon size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              ref={isFloating ? floatingSearchInputRef : staticSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search botanical serums, SPF, moisturizers, cleansers..."
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none focus:ring-1 focus:ring-emerald-700 text-gray-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>

          {/* Search Suggestions dropdown */}
          {searchResults.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 max-h-72 overflow-y-auto">
              {searchResults.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    navigate(`/product/${p.id}`);
                    setSearchOpen(false);
                  }}
                  className="p-2.5 flex items-center justify-between hover:bg-emerald-50/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <ProductImage product={p} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-gray-900 block font-display">
                        {p.name}
                      </strong>
                      <span className="text-[10px] text-gray-500">{p.category}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#123d32] font-display">
                    ${p.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Top Announcement Bar in Normal Page Flow */}
      <div className="bg-[#123d32] text-white text-[11px] font-bold py-1.5 px-4 sm:px-8 border-b border-emerald-900/40">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
              Exclusive Ritual
            </span>
            <span className="truncate text-emerald-100/90 font-medium">
              Free Express Botanical Delivery on orders over $60 • Certified 100% Organic & Clinical Actives
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-emerald-200/80 text-[11px] shrink-0 font-medium">
            <span>🌿 100% Vegan</span>
            <span className="text-emerald-700">•</span>
            <span>🔬 Dermatologist Tested</span>
            <span className="text-emerald-700">•</span>
            <span>📞 Atelier Support</span>
          </div>
        </div>
      </div>

      {/* Initial In-Flow Header: natural document flow, NOT fixed at the top */}
      <header className="relative w-full bg-white/95 border-b border-gray-200">
        {renderHeaderContent(false)}
        {!scrolledPast && renderSearchDrawer(false)}
      </header>

      {/* Floating Header: smoothly slides down into view as the user scrolls down */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md transition-all duration-300 ease-out ${
          scrolledPast
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
        aria-hidden={!scrolledPast}
      >
        {renderHeaderContent(true)}
        {scrolledPast && renderSearchDrawer(true)}
      </header>

      {/* Mobile Navigation Drawer & Backdrop (Rendered once globally) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-950/50 backdrop-blur-xs animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Drawer */}
          <aside className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col z-10 animate-slide-left">
            {/* Drawer Top Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Main Navigation Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 px-1">
                  Navigation
                </span>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-[#123d32] text-amber-300 shadow-sm"
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className={`text-xs ${isActive ? "text-amber-300" : "text-gray-400"}`}>→</span>
                    </Link>
                  );
                })}
              </div>

              {/* Special Offers Banner */}
              <Link
                to="/discount"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950 to-rose-900 text-white flex items-center justify-between shadow-md block"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 block">
                    Limited Sets
                  </span>
                  <strong className="text-xs font-bold font-display block">Special Deals & Offers</strong>
                  <span className="text-[11px] text-rose-200">Save up to 30% today</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-black text-xs">
                  30% OFF
                </span>
              </Link>

              {/* Popular Categories */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-1">
                  Botanical Formulations
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {featuredCategories.map((c) => (
                    <Link
                      key={c.name}
                      to={c.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors"
                    >
                      <span className="block truncate">{c.name}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{c.count}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Currency Switcher in Mobile Drawer */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-1">
                  Currency Preference
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { code: "USD", label: "USD ($)" },
                    { code: "ETB", label: "ETB (Birr)" },
                  ].map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        currency === curr.code
                          ? "bg-emerald-950 text-amber-300 border-emerald-950 shadow-2xs"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      <span>{curr.label}</span>
                      {currency === curr.code && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Guarantees */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 font-medium space-y-1">
              <p>🌿 100% Certified Vegan & Organic</p>
              <p>🚚 Free Botanical Express Delivery &gt; $60</p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
