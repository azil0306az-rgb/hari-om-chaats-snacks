import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/restaurantInfo';

export const CartDrawer = ({ isOpen, onClose, onProceedToCheckout }) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemsCount,
    subtotal,
    packingCharges,
    gstRate,
    gstAmount,
    grandTotal,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer content */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 max-h-[92vh] flex flex-col animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-stone-900 leading-tight">
                Your Cart
              </h2>
              <span className="text-xs text-stone-500">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} • Hari Om Saibaba Colony
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-stone-400 hover:text-red-500 px-2 py-1 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 flex items-center justify-center text-stone-600 border border-stone-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {cart.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center my-auto">
            <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 mb-3">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="font-display font-bold text-lg text-stone-900">Your Cart is Empty</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs">
              Explore our freshly prepared chaats, crispy snacks, and signature drinks!
            </p>
            <button
              onClick={onClose}
              className="mt-5 px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-sm transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Pickup takeaway info notice */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-2.5 text-xs text-amber-900">
              <span className="text-base">🛍️</span>
              <p className="leading-snug">
                <strong>Pickup (Takeaway)</strong> at 196, Neel Complex, Saibaba Colony. Ready in approx. 10–15 mins!
              </p>
            </div>

            {/* Itemized List */}
            <div className="divide-y divide-stone-100">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  {/* Item Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-sm text-stone-900 truncate">
                      {item.name}
                    </h4>

                    {/* Customizations tags */}
                    {item.customizations && item.customizations.length > 0 && (
                      <p className="text-[11px] text-brand-600 font-medium truncate mt-0.5">
                        {item.customizations.map((c) => c.name).join(', ')}
                      </p>
                    )}

                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-extrabold text-sm text-stone-900">
                        ₹{item.price * item.quantity}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[11px] text-stone-400">
                          (₹{item.price} each)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-2 bg-stone-100 rounded-full px-2 py-1 border border-stone-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 rounded-full bg-white text-stone-700 flex items-center justify-center hover:bg-stone-200 transition-colors shadow-2xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-stone-900 min-w-[14px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary Section (Exact table from Section 8 of prompt) */}
            <div className="pt-4 border-t border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-sm text-stone-900">
                  Bill Summary
                </h4>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 100% Verified
                </span>
              </div>

              <div className="bg-stone-50 rounded-2xl p-3.5 space-y-2 border border-stone-200/80 text-xs text-stone-700">
                {/* Food Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">
                    Food subtotal ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
                  </span>
                  <span className="font-bold text-stone-900">₹{subtotal.toFixed(2)}</span>
                </div>

                {/* Packing Charges */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-stone-600">
                    <span>Packing charges ({totalItemsCount} × ₹{RESTAURANT_INFO.packingChargePerItem})</span>
                  </div>
                  <span className="font-bold text-stone-900">₹{packingCharges.toFixed(2)}</span>
                </div>

                {/* GST */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-stone-600">
                    <span>GST ({(gstRate * 100).toFixed(0)}%)</span>
                    <span className="text-[10px] text-stone-400">(Taxes applicable)</span>
                  </div>
                  <span className="font-bold text-stone-900">₹{gstAmount.toFixed(2)}</span>
                </div>

                {/* Grand Total */}
                <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-extrabold text-stone-900">
                  <span className="font-display">Total Amount</span>
                  <span className="font-display text-base text-brand-600">₹{grandTotal}</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-400 text-center">
                Includes { (gstRate * 100).toFixed(0) }% GST and ₹{RESTAURANT_INFO.packingChargePerItem}/item hygienic container packaging
              </p>
            </div>
          </div>
        )}

        {/* Footer Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-stone-200 safe-pb">
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-700 hover:to-amber-600 active:scale-98 text-white font-display font-bold text-base shadow-lg shadow-brand-500/25 flex items-center justify-between transition-all"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-xl">
                <span>₹{grandTotal}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
