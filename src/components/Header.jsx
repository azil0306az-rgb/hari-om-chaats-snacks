import React, { useState } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { HariOmLogo } from './HariOmLogo';

export const Header = ({ onOpenDrawer, onSearchChange, searchQuery, onOpenCart }) => {
  const { totalItemsCount, isCartBouncing } = useCart();
  const [showSearchInput, setShowSearchInput] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/70 shadow-xs transition-all safe-top">
      <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2.5">
        {/* Left: Hamburger Menu Button matching Screen 01 */}
        <button
          onClick={onOpenDrawer}
          className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center: Hari Om Official Logo */}
        <div className="flex-1 flex justify-center">
          <a href="/" className="flex items-center group">
            <HariOmLogo size="sm" variant="strong" />
          </a>
        </div>

        {/* Right Action Controls: Search & Cart matching Screen 01 */}
        <div className="flex items-center gap-1.5">
          {showSearchInput ? (
            <div className="flex items-center bg-stone-100 rounded-full px-3 py-1.5 w-44 sm:w-56 border border-stone-200 animate-fade-in">
              <Search className="w-4 h-4 text-stone-400 mr-1.5 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search chaats, toasts..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-transparent text-xs text-stone-800 placeholder-stone-400 focus:outline-none"
              />
              <button
                onClick={() => {
                  setShowSearchInput(false);
                  onSearchChange('');
                }}
                className="p-0.5 hover:bg-stone-200 rounded-full text-stone-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearchInput(true)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
              title="Search menu"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* Cart Icon Button with Live Count Badge */}
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            className={`relative p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-all ${
              isCartBouncing ? 'scale-110 text-brand-600' : ''
            }`}
            title="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute top-1 right-1 bg-brand-600 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
