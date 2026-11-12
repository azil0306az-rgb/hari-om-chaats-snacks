import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, Check, ChefHat, CheckCircle2, ChevronRight, Receipt, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/restaurantInfo';
import { HariOmLogo } from '../components/HariOmLogo';

export const OrdersView = ({ onSelectOrder, onStartOrdering }) => {
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('all'); // 'all' | 'ongoing' | 'past'

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('hariom_orders') || '[]');
      setOrders(saved);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleReorder = (order, e) => {
    e.stopPropagation();
    order.items.forEach((item) => {
      addToCart(item, item.customizations || []);
    });
  };

  return (
    <div className="px-4 py-4 space-y-4 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight">
          My Orders & Tracking
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Live kitchen preparation tracking & digital bill receipts
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-stone-200/80 p-8 shadow-soft">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center mb-3">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">
            No Orders Yet
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs">
            Hungry? Browse our authentic Coimbatore chaats, hot pav bhaji and crispy snacks!
          </p>
          <button
            onClick={onStartOrdering}
            className="mt-4 px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Explore Menu & Order
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Latest Order Live Tracking Card (Screen 09) */}
          {orders[0] && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-brand-200 shadow-card space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <HariOmLogo size="xs" />
                  <span className="font-display font-extrabold text-base text-stone-900">
                    Order #{orders[0].orderId}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Preparing
                </span>
              </div>

              {/* Progress Timeline matching Screen 09 */}
              <div className="space-y-3 pl-2 py-1 text-xs">
                {/* 1. Confirmed */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 z-10 shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">Order Confirmed</div>
                    <div className="text-[11px] text-stone-500">
                      {new Date(orders[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="absolute left-3 top-6 w-0.5 h-7 bg-brand-400" />
                </div>

                {/* 2. Preparing */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0 z-10 shadow-2xs animate-pulse">
                    <ChefHat className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-brand-700">Preparing in Kitchen</div>
                    <div className="text-[11px] text-stone-500">
                      We're getting your order ready fresh & hot
                    </div>
                  </div>
                  <div className="absolute left-3 top-6 w-0.5 h-7 bg-stone-300" />
                </div>

                {/* 3. Ready */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center shrink-0 z-10">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-700">Ready for Pickup</div>
                    <div className="text-[11px] text-stone-400">
                      We'll hand over your takeaway at counter
                    </div>
                  </div>
                </div>
              </div>

              {/* Pickup timing & Address */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs space-y-1">
                <div className="flex justify-between items-center text-stone-700 font-medium">
                  <span>Pickup:</span>
                  <span className="font-bold text-brand-700">{orders[0].pickupTiming}</span>
                </div>
                <div className="flex justify-between items-center text-stone-700 font-medium">
                  <span>Total Amount:</span>
                  <span className="font-extrabold text-sm text-stone-900">₹{orders[0].grandTotal}</span>
                </div>
              </div>

              {/* View Bill Receipt Button */}
              <button
                onClick={() => onSelectOrder(orders[0])}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <Receipt className="w-3.5 h-3.5 text-amber-400" />
                <span>View & Print Bill Receipt</span>
              </button>
            </div>
          )}

          {/* Past Orders List */}
          <div>
            <h4 className="font-display font-bold text-sm text-stone-900 mb-2.5">
              Order History
            </h4>
            <div className="space-y-2.5">
              {orders.map((ord) => (
                <div
                  key={ord.orderId}
                  onClick={() => onSelectOrder(ord)}
                  className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-soft hover:border-brand-300 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">
                        #{ord.orderId}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        • {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 truncate mt-0.5">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                    <div className="mt-1 text-xs font-bold text-stone-900">
                      ₹{ord.grandTotal}{' '}
                      <span className="text-[11px] font-normal text-stone-400">
                        ({ord.totalItemsCount} items)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleReorder(ord, e)}
                      className="px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-[11px] transition-colors"
                    >
                      Re-order
                    </button>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
