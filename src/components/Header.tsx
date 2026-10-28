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
    <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-display font-black text-sm sm:text-base flex items-center justify-center shadow-md group-hover:scale-105 transition-transform ${
          light ? "bg-amber-400 text-emerald-950" : "bg-[#123d32] text-amber-400"
        }`}
      >
        OD
      </div>
      <div>
        <span
          className={`font-display font-black text-lg sm:text-xl tracking-tight block leading-tight ${
            light ? "text-white" : "text-gray-950"
          }`}
        >
          ODILIA
        </span>
        <span
          className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest block ${
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Close search & menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setMegaMenuOpen(false);
    setCurrencyDropdownOpen(false);
  }, [location.pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <>
      {/* Top Announcement Bar */}
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

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo */}
          <Logo />

          {/* Navigation Links */}
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

            {/* Rituals & Categories Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                className={`text-sm font-bold tracking-tight transition-colors py-1 flex items-center gap-1.5 ${
                  megaMenuOpen ? "text-[#123d32]" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>Rituals & Care</span>
                <ChevronDownIcon size={14} className="text-gray-400" />
              </button>

              {/* Mega Dropdown */}
              {megaMenuOpen && (
                <div className="absolute left-0 top-full pt-2 w-80 z-50 animate-scale-up">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 space-y-1">
                    <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Targeted Formulations
                      </span>
                    </div>
                    {featuredCategories.map((cat) => (
                      <Link
                        key={cat.name}
                        to={cat.path}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{cat.count}</span>
                      </Link>
                    ))}
                    <div className="pt-1.5 border-t border-gray-100 mt-1">
                      <Link
                        to="/discount"
                        className="px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50/70 hover:bg-rose-100 flex items-center justify-between transition-colors"
                      >
                        <span>✨ Special Discounted Sets</span>
                        <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded-full font-black">
                          Save up to 30%
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 sm:p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
              title="Search formulations"
              aria-label="Search"
            >
              <SearchIcon size={18} />
            </button>

            {/* Currency Selector Dropdown */}
            <div className="relative" ref={currencyRef}>
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-800 transition-colors"
                title="Switch Currency"
              >
                <span className="w-5 h-5 rounded-md bg-emerald-950 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                  {currency === "USD" ? "$" : "ETB"}
                </span>
                <span className="hidden sm:inline font-mono text-[11px]">{currency}</span>
                <Icon name="chevron" size={12} className="text-gray-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-scale-up">
                  <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Active Currency
                    </span>
                  </div>
                  {[
                    { code: "USD", label: "US Dollar ($)", rate: "Base Rate" },
                    { code: "ETB", label: "Ethiopian Birr (ETB)", rate: "1 USD = 130 ETB" },
                  ].map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code as any);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        currency === curr.code
                          ? "bg-emerald-950 text-white font-bold"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div>
                        <span className="block font-bold">{curr.label}</span>
                        <span
                          className={`text-[9px] block ${
                            currency === curr.code ? "text-emerald-200" : "text-gray-400"
                          }`}
                        >
                          {curr.rate}
                        </span>
                      </div>
                      {currency === curr.code && (
                        <Icon name="check" size={12} className="text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={openWishlist}
              className="p-2 sm:p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 relative transition-colors"
              title="Saved Formulations Wishlist"
              aria-label="Wishlist"
            >
              <HeartIcon size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button (Doqa Style) */}
            <button
              onClick={openCart}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#123d32] text-white rounded-xl text-xs font-bold hover:bg-[#1a4a3e] transition-all shadow-sm relative group shrink-0 active:scale-98"
              title="View Shopping Bag"
            >
              <BagIcon size={16} className="text-amber-400" />
              <span className="hidden sm:inline">Shopping Bag</span>
              {cartCount > 0 && (
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-black text-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <CloseIcon size={20} /> : <Icon name="menu" size={20} />}
            </button>
          </div>
        </div>

        {/* Live Search Drawer / Flyout */}
        {searchOpen && (
          <div className="border-t border-gray-200 bg-white px-4 sm:px-8 py-3.5 shadow-md animate-fade-in">
            <div className="max-w-[1600px] mx-auto space-y-3">
              <div className="relative">
                <SearchIcon size={16} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search botanical serums, SPF, moisturizers, cleansers..."
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none focus:ring-1 focus:ring-emerald-700 text-gray-900"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
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
        )}

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 px-4 py-4 bg-white space-y-3 animate-fade-in shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-gray-800 hover:text-emerald-950 border-b border-gray-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Popular Categories
              </span>
              <div className="grid grid-cols-2 gap-2">
                {featuredCategories.map((c) => (
                  <Link
                    key={c.name}
                    to={c.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-gray-50 text-[11px] font-semibold text-gray-700 hover:bg-emerald-50"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
