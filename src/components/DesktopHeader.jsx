import React, { useState } from 'react';
import { Search, ShoppingBag, Phone, MapPin, Clock, Tag, ExternalLink } from 'lucide-react';
import { HariOmLogo } from './HariOmLogo';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/restaurantInfo';

export const DesktopHeader = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenInfo,
}) => {
  const { totalItemsCount, subtotal } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
      {/* Top micro info bar */}
      <div className="bg-[#201A16] text-stone-300 px-6 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href="https://maps.app.goo.gl/FT9isZCy8gY2UDkN7"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-stone-300 hover:text-amber-300 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span>196, Neel Complex, Saibaba Colony (Google Maps)</span>
          </a>
          <span className="hidden lg:flex items-center gap-1 text-amber-300">
            <Clock className="w-3.5 h-3.5" />
            <span>Open Today: 1:00 PM – 10:00 PM</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${RESTAURANT_INFO.phone}`}
            className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-brand-400" />
            <span>Order Helpline: 9940169618 / 9600055167</span>
          </a>

          <div className="flex items-center gap-2 pl-3 border-l border-stone-700 text-[11px]">
            <a
              href="/billing"
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors"
            >
              Billing POS
            </a>
            <span className="text-stone-600">•</span>
            <a
              href="/admin"
              className="text-stone-400 hover:text-white transition-colors"
            >
              Admin
            </a>
          </div>
        </div>
      </div>

      {/* Main Desktop Navbar */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        {/* Left: Official Logo */}
        <div className="flex items-center gap-3">
          <a href="/" className="cursor-pointer">
            <HariOmLogo size="md" variant="strong" />
          </a>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="flex items-center gap-1 bg-stone-50 p-1 rounded-2xl border border-stone-200">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'home'
                ? 'bg-brand-500 text-white shadow-2xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onSelectTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'menu'
                ? 'bg-brand-500 text-white shadow-2xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            Full Menu
          </button>

          <button
            onClick={() => onSelectTab('offers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'offers'
                ? 'bg-brand-500 text-white shadow-2xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span>Today's Specials</span>
          </button>

          <button
            onClick={() => onSelectTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-brand-500 text-white shadow-2xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            My Orders
          </button>

          <button
            onClick={onOpenInfo}
            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
          >
            Store Info
          </button>
        </nav>

        {/* Right: Search & Cart Button */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search chaats, pav bhaji..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {totalItemsCount > 0 && (
              <span className="bg-white text-brand-600 px-2 py-0.5 rounded-full text-[11px] font-black">
                {totalItemsCount} • ₹{subtotal}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
