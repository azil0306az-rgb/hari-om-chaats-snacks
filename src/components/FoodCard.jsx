import React, { useRef } from 'react';
import { Plus, Minus, Clock, Star, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FoodCard = ({ item, onOpenDetail }) => {
  const { cart, addToCart, updateQuantity, getProductQuantity } = useCart();
  const cardRef = useRef(null);
  const addBtnRef = useRef(null);

  // Total quantity of this product currently in cart
  const quantity = getProductQuantity(item.id);

  // Find exact first item in cart if already added (for increment/decrement)
  const cartItem = cart.find((c) => c.productId === item.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    // If the item has customizations and isn't yet in cart, open the customizer modal
    if (item.customizations && item.customizations.length > 0 && quantity === 0) {
      onOpenDetail(item);
      return;
    }
    // Direct add with animation
    addToCart(item, [], addBtnRef.current || cardRef.current);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    } else {
      addToCart(item, [], addBtnRef.current || cardRef.current);
    }
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onOpenDetail(item)}
      className="group relative bg-white rounded-2xl p-3 sm:p-3.5 border border-stone-200/80 hover:border-brand-300 shadow-soft hover:shadow-card transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Section: Photo + Veg Tag + Badges */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 mb-2.5">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80';
          }}
        />

        {/* Veg Badge (Green dot in square) */}
        <div className="absolute top-2 left-2 w-4 h-4 bg-white/95 backdrop-blur-sm rounded flex items-center justify-center border border-emerald-600/60 shadow-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-600" />
        </div>

        {/* Bestseller Badge */}
        {item.bestseller && (
          <span className="absolute top-2 right-2 bg-amber-500/95 text-stone-900 font-bold text-[10px] tracking-wide px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5 backdrop-blur-xs">
            <Star className="w-2.5 h-2.5 fill-stone-900" /> Bestseller
          </span>
        )}

        {/* Spicy Badge */}
        {item.spicyLevel === 'spicy' && (
          <span className="absolute bottom-2 left-2 bg-red-600/90 text-white font-semibold text-[9px] px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
            <Flame className="w-2.5 h-2.5 fill-white" /> Spicy
          </span>
        )}

        {/* Prep Time */}
        <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {item.prepTime}
        </span>
      </div>

      {/* Middle Section: Food Title & Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-display font-bold text-sm sm:text-base text-stone-900 leading-snug group-hover:text-brand-600 transition-colors">
              {item.name}
            </h3>
          </div>

          <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Rating and Customization hint */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400">
          <span className="flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            {item.rating} <span className="text-stone-400 font-normal">({item.ratingCount})</span>
          </span>

          {item.customizations && item.customizations.length > 0 && (
            <span className="text-[10px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
              Customizable
            </span>
          )}
        </div>

        {/* Bottom Section: Price + Add Button / Quantity Selector */}
        <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-extrabold text-base sm:text-lg text-stone-900">
              ₹{item.price}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ₹{item.originalPrice}
              </span>
            )}
          </div>

          {/* Action: Add Button vs Quantity Selector */}
          <div>
            {quantity > 0 ? (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 bg-brand-50 border border-brand-300 rounded-full px-2 py-1 shadow-xs"
              >
                <button
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                  className="w-6 h-6 rounded-full bg-white text-brand-600 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors shadow-xs active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-xs sm:text-sm text-brand-700 min-w-[14px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                  className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors shadow-xs active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                ref={addBtnRef}
                onClick={handleAdd}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-sm shadow-brand-500/20 transition-all"
              >
                <span>Add</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
