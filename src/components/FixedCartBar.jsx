import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FixedCartBar = () => {
  const { totalItemsCount, grandTotal, setIsCartOpen, isCartBouncing } = useCart();

  if (totalItemsCount === 0) return null;

  return (
    <div 
      className="fixed inset-x-0 z-35 px-4 pointer-events-none transition-all duration-300 animate-slide-up"
      style={{
        bottom: 'calc(62px + max(0.5rem, env(safe-area-inset-bottom)))'
      }}
    >
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          id="bottom-cart-bar"
          onClick={() => setIsCartOpen(true)}
          className={`w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 text-white shadow-floating flex items-center justify-between transition-all duration-200 active:scale-98 ${
            isCartBouncing ? 'scale-103 ring-4 ring-amber-300/60' : 'hover:shadow-xl'
          }`}
        >
          {/* Left info: Icon + Item count + Total */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>

            <div className="text-left">
              <div className="text-[10px] font-semibold text-amber-100 uppercase tracking-wider">
                {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'} Added
              </div>
              <div className="font-display font-extrabold text-sm sm:text-base text-white leading-none mt-0.5">
                ₹{grandTotal} <span className="text-[11px] font-normal text-amber-100">(incl. taxes)</span>
              </div>
            </div>
          </div>

          {/* Right action: "View Cart →" */}
          <div className="flex items-center gap-1.5 bg-white text-brand-700 font-display font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-xs shrink-0 group">
            <span>View Cart</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </button>
      </div>
    </div>
  );
};
