import React from 'react';
import { X, MapPin, Phone, Clock, ShoppingBag, ShieldCheck, ExternalLink, MessageCircle } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantInfo';
import { HariOmLogo } from './HariOmLogo';

export const RestaurantInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        {/* Banner with emblem */}
        <div className="relative bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 p-6 text-center text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex justify-center">
            <HariOmLogo variant="raw" className="h-16 w-auto drop-shadow-md" />
          </div>
          <h2 className="font-display font-bold text-xl mt-3 text-white">
            {RESTAURANT_INFO.name}
          </h2>
          <p className="text-xs text-amber-300 font-medium mt-0.5">
            {RESTAURANT_INFO.subtitle}
          </p>
        </div>

        {/* Info details */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-stone-700">
          {/* Location */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-stone-900 text-sm">Store Address</div>
              <p className="text-stone-600 mt-0.5 leading-relaxed">
                {RESTAURANT_INFO.address}
              </p>
              <a
                href={RESTAURANT_INFO.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 font-bold text-brand-600 hover:text-brand-700"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Timings */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-stone-900 text-sm">Operating Hours</div>
              <p className="text-stone-600 mt-0.5 font-medium">
                Open Every Day: <strong className="text-stone-900">{RESTAURANT_INFO.hours}</strong>
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                ● Fresh batches prepared throughout evening hours
              </p>
            </div>
          </div>

          {/* Phone & Party Orders */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-stone-900 text-sm">Contact & Party Orders</div>
              <p className="text-stone-600 mt-0.5 leading-relaxed">
                Bulk orders, birthday parties and event catering accepted.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <a
                  href={`tel:${RESTAURANT_INFO.phone}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call {RESTAURANT_INFO.displayPhone}</span>
                </a>
                <a
                  href={`https://wa.me/91${RESTAURANT_INFO.phone}?text=Hi%20Hari%20Om%20Chaats,%20I%20would%20like%20to%20order`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-green-500 text-white font-bold text-xs inline-flex items-center gap-1.5 hover:bg-green-600 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Notice & Packaging policy */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-[11px] text-amber-900 leading-relaxed">
            <strong>Hygiene & Packaging Guarantee:</strong> ₹{RESTAURANT_INFO.packingChargePerItem} per item applicable for spill-proof, food-grade takeaway packaging keeping puris crisp and gravies piping hot.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition-colors"
          >
            Back to Ordering
          </button>
        </div>
      </div>
    </div>
  );
};
