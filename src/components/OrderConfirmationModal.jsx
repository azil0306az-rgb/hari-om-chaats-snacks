import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, CheckCircle2, Clock, MapPin, Phone, Receipt, ArrowRight, ChefHat, ShoppingBag, Sparkles, X } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantInfo';
import { HariOmLogo } from './HariOmLogo';

export const OrderConfirmationModal = ({ order, onClose, onOpenReceipt }) => {
  const [activeStep, setActiveStep] = useState(2); // 1: Confirmed, 2: Preparing, 3: Ready, 4: Picked up

  useEffect(() => {
    // Fire confetti burst upon confirmation
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F95A08', '#EAB308', '#16A34A', '#FA8520'],
      });
    } catch (e) {
      console.log('Confetti not available', e);
    }

    // Simulate progress timer (kitchen prep)
    const timer = setTimeout(() => {
      setActiveStep(2);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 max-h-[92vh] flex flex-col animate-slide-up overflow-hidden">
        {/* Header with close */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <HariOmLogo size="xs" />
            <span className="text-xs font-bold text-stone-700">Order Confirmed</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 flex items-center justify-center text-stone-600 border border-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-center">
          {/* Animated Success Badge */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-md">
                <Check className="w-10 h-10 stroke-[3] animate-bounce-short" />
              </div>
              <span className="absolute -bottom-1 -right-1 text-xl">🎉</span>
            </div>

            <h2 className="font-display text-2xl font-extrabold text-stone-900 mt-3">
              Order Placed!
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-xs">
              Thank you, <strong>{order.customerName}</strong>! Your order is being freshly prepared in our kitchen.
            </p>

            {/* Order ID Pill */}
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold">
              <span>Order ID:</span>
              <span className="font-mono text-sm font-extrabold text-brand-600">
                #{order.orderId}
              </span>
            </div>
          </div>

          {/* Live Order Tracker (Screen 08 & 09 from mockup) */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
              <span>Order Status</span>
              <span className="text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded text-[11px]">
                Active
              </span>
            </div>

            <div className="space-y-3 pl-2">
              {/* Step 1: Confirmed */}
              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 z-10 shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-stone-900">Order Confirmed</div>
                  <div className="text-[11px] text-stone-500">
                    Received at counter • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {/* Connecting Line */}
                <div className="absolute left-3 top-6 w-0.5 h-7 bg-brand-400" />
              </div>

              {/* Step 2: Preparing */}
              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0 z-10 shadow-xs animate-pulse">
                  <ChefHat className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-brand-700 flex items-center gap-1.5">
                    <span>Preparing Fresh in Kitchen</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Master halwai is assembling your hot chaats & snacks
                  </div>
                </div>
                {/* Connecting Line */}
                <div className="absolute left-3 top-6 w-0.5 h-7 bg-stone-300" />
              </div>

              {/* Step 3: Ready for pickup */}
              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center shrink-0 z-10">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-stone-700">Ready for Counter Pickup</div>
                  <div className="text-[11px] text-stone-400">
                    Estimated in ~10–15 mins
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Details Card */}
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Pickup Timing: {order.pickupTiming}</span>
            </div>

            <div className="flex items-start gap-2 pt-2 border-t border-amber-200/60 text-stone-700">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong>Hari Om Chaats & Snacks</strong>
                <p className="text-[11px] text-stone-600 leading-snug mt-0.5">
                  {RESTAURANT_INFO.address}
                </p>
                <div className="mt-1 flex items-center gap-3">
                  <a
                    href={`tel:${RESTAURANT_INFO.phone}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:underline"
                  >
                    <Phone className="w-3 h-3" /> Call Restaurant ({RESTAURANT_INFO.phone})
                  </a>
                  <a
                    href="https://maps.app.goo.gl/FT9isZCy8gY2UDkN7"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-md transition-colors"
                  >
                    <span>Get Directions</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Mini Table */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left space-y-2">
            <div className="font-bold text-xs text-stone-900">
              Items Ordered ({order.totalItemsCount})
            </div>
            <div className="divide-y divide-stone-100 text-xs">
              {order.items.map((item) => (
                <div key={item.id} className="py-1.5 flex justify-between items-center text-stone-700">
                  <span className="truncate">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="font-bold text-stone-900 shrink-0">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-extrabold text-stone-900">
              <span>Total Paid / Payable</span>
              <span className="text-brand-600 text-base font-display">₹{order.grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-stone-200 space-y-2 safe-pb">
          {/* View / Print Receipt */}
          <button
            onClick={() => onOpenReceipt(order)}
            className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Receipt className="w-4 h-4 text-amber-400" />
            <span>View & Print Bill Receipt</span>
          </button>

          {/* Order More / Back to Menu */}
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
          >
            Order More / Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};
