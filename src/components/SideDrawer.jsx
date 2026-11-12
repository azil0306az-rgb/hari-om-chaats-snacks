import React from 'react';
import { X, Home, UtensilsCrossed, Tag, ShoppingBag, User, Phone, MapPin, Clock, ExternalLink, Receipt } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantInfo';
import { HariOmLogo } from './HariOmLogo';

export const SideDrawer = ({ isOpen, onClose, onSelectTab, onOpenInfo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-start bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10 flex flex-col animate-slide-up">
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-br from-stone-900 to-stone-850 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HariOmLogo variant="dark" className="h-9 w-auto" />
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 text-sm font-semibold text-stone-700">
          <button
            onClick={() => {
              onSelectTab('home');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-colors"
          >
            <Home className="w-4 h-4 text-brand-500" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('menu');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4 text-brand-500" />
            <span>All Menu Categories</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('offers');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-colors"
          >
            <Tag className="w-4 h-4 text-amber-500" />
            <span>Today's Specials & Deals</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('orders');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-brand-500" />
            <span>My Orders & Tracking</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('account');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-colors"
          >
            <User className="w-4 h-4 text-stone-500" />
            <span>My Profile & Store Info</span>
          </button>

          {/* Quick Staff Portals */}
          <div className="pt-3 mt-3 border-t border-stone-100 space-y-1.5">
            <p className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Staff & Ops Portals
            </p>
            <a
              href="/billing"
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Receipt className="w-3.5 h-3.5 text-amber-700" />
                <span>Billing POS Terminal</span>
              </div>
              <span className="text-[10px] bg-amber-200/60 px-1.5 py-0.5 rounded text-amber-800">POS</span>
            </a>
            <a
              href="/admin"
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold border border-stone-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-brand-600" />
                <span>Admin Dashboard</span>
              </div>
              <span className="text-[10px] bg-stone-200 px-1.5 py-0.5 rounded text-stone-700">Admin</span>
            </a>
          </div>

          <div className="pt-2 mt-2 border-t border-stone-100 space-y-2">
            <button
              onClick={() => {
                onOpenInfo();
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700"
            >
              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Operating Hours</span>
              </div>
              <p className="text-stone-500 mt-0.5">1:00 PM – 10:00 PM Daily</p>
            </button>

            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Store: {RESTAURANT_INFO.displayPhone}</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-center">
          <p className="text-[11px] text-stone-500 font-sans">
            Hari Om Chaats & Snacks
          </p>
          <p className="text-[10px] text-stone-400">
            Saibaba Colony, Coimbatore
          </p>
        </div>
      </div>
    </div>
  );
};
