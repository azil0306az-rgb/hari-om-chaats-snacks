import React, { useState } from 'react';
import { X, Heart, Star, Clock, Plus, Minus, Check, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ItemDetailModal = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!item) return null;

  const toggleCustomization = (cust) => {
    if (selectedCustomizations.some((c) => c.id === cust.id)) {
      setSelectedCustomizations((prev) => prev.filter((c) => c.id !== cust.id));
    } else {
      setSelectedCustomizations((prev) => [...prev, cust]);
    }
  };

  const extraCost = selectedCustomizations.reduce((sum, c) => sum + (c.price || 0), 0);
  const unitPrice = item.price + extraCost;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = (e) => {
    addToCart(item, selectedCustomizations, e.currentTarget);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header Image */}
        <div className="relative w-full h-56 sm:h-64 bg-stone-100 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Top Controls */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-stone-800 flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-700'
                }`}
              />
            </button>
          </div>

          {/* Veg tag on Image */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded flex items-center justify-center border border-emerald-600 shadow">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            </div>
            <span className="text-white text-xs font-semibold drop-shadow">100% Pure Vegetarian</span>
          </div>

          {/* Prep time badge */}
          <div className="absolute bottom-3 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
            <Clock className="w-3 h-3" />
            <span>{item.prepTime}</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                {item.name}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {item.rating} ({item.ratingCount}+ orders)
                </span>
                {item.spicyLevel && (
                  <span className="text-xs text-stone-500 flex items-center gap-1 capitalize">
                    <Flame className="w-3 h-3 text-red-500" />
                    {item.spicyLevel} spice
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="font-display font-extrabold text-2xl text-stone-900">
                ₹{unitPrice}
              </span>
              {item.originalPrice && (
                <div className="text-xs text-stone-400 line-through">
                  ₹{item.originalPrice}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-stone-600 leading-relaxed">
            {item.description}
          </p>

          {/* Customizations Section */}
          {item.customizations && item.customizations.length > 0 && (
            <div className="pt-3 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                Customize (Optional)
              </h4>
              <div className="space-y-2">
                {item.customizations.map((cust) => {
                  const isChecked = selectedCustomizations.some((c) => c.id === cust.id);
                  return (
                    <label
                      key={cust.id}
                      onClick={() => toggleCustomization(cust)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                        isChecked
                          ? 'border-brand-500 bg-brand-50/50 text-stone-900'
                          : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-brand-500 text-white' : 'border border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span>{cust.name}</span>
                      </div>
                      {cust.price > 0 && (
                        <span className="text-xs font-bold text-brand-600">
                          +₹{cust.price}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-sm font-bold text-stone-800">Quantity</span>
            <div className="flex items-center gap-3 bg-stone-100 rounded-full px-3 py-1.5 border border-stone-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-7 h-7 rounded-full bg-white text-stone-800 flex items-center justify-center disabled:opacity-40 hover:bg-stone-200 transition-colors shadow-xs"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-extrabold text-stone-900 text-base min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Button */}
        <div className="p-4 bg-stone-50 border-t border-stone-100">
          <button
            onClick={handleAddToCart}
            className="w-full py-3.5 px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-98 text-white font-display font-bold text-base shadow-lg shadow-brand-500/25 flex items-center justify-between transition-all"
          >
            <span>Add to Cart</span>
            <span className="bg-black/15 px-3 py-1 rounded-lg">
              ₹{totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
