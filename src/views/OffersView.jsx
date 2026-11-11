import React, { useState } from 'react';
import { Tag, Sparkles, Check, Copy, ArrowRight, Star, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MENU_ITEMS } from '../data/menuData';

export const OffersView = ({ onOpenDetail }) => {
  const { addToCart } = useCart();
  const [copiedCode, setCopiedCode] = useState(null);

  const specialItems = MENU_ITEMS.filter((i) => i.originalPrice || i.category === 'special-picks').slice(0, 4);

  const coupons = [
    {
      code: 'HARIOM10',
      discount: '10% OFF',
      desc: 'On all takeaway orders above ₹200',
      badge: 'Most Popular',
    },
    {
      code: 'PARTY50',
      discount: '₹50 FLAT OFF',
      desc: 'On bulk snack orders above ₹400',
      badge: 'Party Orders',
    },
    {
      code: 'FREESHAKE',
      discount: 'FREE DRINK',
      desc: 'With any 3 jumbo grilled sandwiches',
      badge: 'Combo Deal',
    },
  ];

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="px-4 py-4 space-y-5 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight flex items-center gap-2">
          <span>Today's Offers & Deals</span>
          <span className="text-sm">🔥</span>
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Exclusive discounts on fresh chaats, snacks & beverages at Saibaba Colony
        </p>
      </div>

      {/* Featured Banner Deal matching Screen 01 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-amber-600 to-amber-500 text-white p-4 sm:p-5 shadow-card flex items-center justify-between gap-3">
        <div className="relative z-10 flex-1">
          <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold tracking-wider uppercase text-amber-200">
            Special Value Deal
          </span>
          <h3 className="font-display font-bold text-lg sm:text-xl text-white mt-1 leading-snug">
            Pani Puri Combo (6 Pcs + Drink)
          </h3>
          <p className="text-xs text-amber-100 mt-0.5">
            6 Crispy tangy puris with your choice of chilled beverage
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display font-extrabold text-xl text-white">₹59</span>
            <span className="text-xs text-amber-200 line-through">₹70</span>
            <span className="text-[11px] font-bold bg-white text-brand-600 px-2 py-0.5 rounded-full shadow-2xs">
              Save ₹11
            </span>
          </div>

          <button
            onClick={() => {
              const combo = MENU_ITEMS.find((i) => i.id === 'pani-puri-combo') || MENU_ITEMS[0];
              addToCart(combo, []);
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-white text-brand-700 font-bold text-xs hover:bg-amber-50 active:scale-95 transition-all shadow-sm"
          >
            Add Deal to Cart
          </button>
        </div>

        <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-white/20 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80"
            alt="Pani Puri Deal"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Coupons List */}
      <div>
        <h4 className="font-display font-bold text-sm text-stone-900 mb-2.5">
          Available Promo Coupons
        </h4>
        <div className="space-y-2.5">
          {coupons.map((c) => (
            <div
              key={c.code}
              className="p-3.5 rounded-2xl bg-white border border-dashed border-stone-300 shadow-soft flex items-center justify-between gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-xs sm:text-sm text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                    {c.code}
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {c.badge}
                  </span>
                </div>
                <div className="font-bold text-xs text-stone-800 mt-1.5">{c.discount}</div>
                <p className="text-[11px] text-stone-500 mt-0.5">{c.desc}</p>
              </div>

              <button
                onClick={() => handleCopy(c.code)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center gap-1 transition-colors"
              >
                {copiedCode === c.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Applied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Special Items Cards */}
      <div>
        <h4 className="font-display font-bold text-sm text-stone-900 mb-2.5">
          Special Chef Combos
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {specialItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenDetail(item)}
              className="bg-white rounded-2xl p-3 border border-stone-200 shadow-soft cursor-pointer hover:border-brand-400 transition-all flex flex-col justify-between"
            >
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 mb-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 right-1.5 bg-brand-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                  SPECIAL
                </span>
              </div>
              <h5 className="font-bold text-xs text-stone-900 truncate">{item.name}</h5>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-extrabold text-sm text-stone-900">₹{item.price}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item, [], e.currentTarget);
                  }}
                  className="px-2.5 py-1 rounded-full bg-brand-500 text-white font-bold text-xs"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
