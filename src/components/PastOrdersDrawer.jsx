import React, { useState, useEffect } from 'react';
import { X, Clock, Receipt, ChevronRight, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

export const PastOrdersDrawer = ({ isOpen, onClose, onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'ongoing' | 'past'

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = JSON.parse(localStorage.getItem('hariom_orders') || '[]');
        setOrders(saved);
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 max-h-[92vh] flex flex-col animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-stone-900 leading-tight">
                My Orders
              </h2>
              <span className="text-xs text-stone-500">
                Track your active & previous Hari Om orders
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 flex items-center justify-center text-stone-600 border border-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {orders.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-2">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-stone-800">No Orders Placed Yet</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                Your past takeaways and active orders will appear here automatically.
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.orderId}
                onClick={() => onSelectOrder(ord)}
                className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-brand-300 hover:shadow-card transition-all cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-sm text-stone-900">
                      #{ord.orderId}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      • {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Preparing
                  </span>
                </div>

                {/* Items preview */}
                <div className="text-xs text-stone-600 truncate">
                  {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="font-bold text-stone-900 text-sm">
                    ₹{ord.grandTotal}{' '}
                    <span className="text-[11px] font-normal text-stone-400">
                      ({ord.totalItemsCount} items)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-brand-600 hover:underline">
                    <span>View Bill</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
