import React from 'react';
import { X, Printer, Download, Share2, CheckCircle2 } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantInfo';
import { HariOmLogo } from './HariOmLogo';

export const OrderBillReceipt = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textContent = `
========================================
       HARI OM CHAATS & SNACKS
   Raja Annamalai Rd, Saibaba Colony,
        Coimbatore - 641011
         Ph: 9940169618
========================================
Order ID    : #${order.orderId}
Date & Time : ${new Date(order.createdAt).toLocaleString()}
Customer    : ${order.customerName}
Phone       : +91 ${order.phoneNumber}
Order Type  : ${order.orderType}
Pickup Time : ${order.pickupTiming}
----------------------------------------
ITEM                      QTY     AMOUNT
----------------------------------------
${order.items
  .map(
    (item) =>
      `${item.name.slice(0, 24).padEnd(25)} ${String(item.quantity).padStart(3)}   ₹${String(
        item.price * item.quantity
      ).padStart(6)}`
  )
  .join('\n')}
----------------------------------------
Subtotal                        ₹${order.subtotal.toFixed(2)}
Packing Charges (${order.totalItemsCount} × ₹5)        ₹${order.packingCharges.toFixed(2)}
GST (5%)                        ₹${order.gstAmount.toFixed(2)}
========================================
TOTAL PAYABLE AMOUNT            ₹${order.grandTotal}
========================================
Payment: ${order.paymentMethod}

        Thank You! Visit Again!
========================================
`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HariOm_Bill_${order.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92vh] animate-slide-up">
        {/* Top Control Bar */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
          <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Verified Bill Receipt
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-700 transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-700 transition-colors"
              title="Download Receipt"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thermal Paper styled Bill */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-stone-800 bg-[#FCFBF8] space-y-3 selection:bg-amber-100 print:p-0">
          {/* Bill Restaurant Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-stone-300">
            <div className="flex justify-center mb-1">
              <HariOmLogo size="sm" />
            </div>
            <p className="text-[11px] text-stone-600 font-sans mt-1">
              {RESTAURANT_INFO.address}
            </p>
            <p className="text-[11px] text-stone-600 font-sans">
              Contact: <strong>{RESTAURANT_INFO.phone}</strong>
            </p>
          </div>

          {/* Bill Meta Details */}
          <div className="space-y-1 text-[11px] text-stone-600 py-1">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-bold text-stone-900">#{order.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-semibold text-stone-900">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Type:</span>
              <span className="font-semibold text-stone-900">{order.orderType}</span>
            </div>
            <div className="flex justify-between">
              <span>Pickup:</span>
              <span className="text-brand-700 font-bold">{order.pickupTiming}</span>
            </div>
          </div>

          {/* Table Header */}
          <div className="border-t border-b border-dashed border-stone-300 py-1.5 flex justify-between font-bold text-stone-900 text-[11px]">
            <span className="w-1/2">Item</span>
            <span className="w-1/6 text-center">Qty</span>
            <span className="w-1/3 text-right">Amount</span>
          </div>

          {/* Items rows */}
          <div className="space-y-1.5 text-[11px] py-1">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="w-1/2 truncate font-sans">
                  <span>{item.name}</span>
                  {item.customizations && item.customizations.length > 0 && (
                    <div className="text-[9px] text-stone-400 truncate">
                      {item.customizations.map((c) => c.name).join(', ')}
                    </div>
                  )}
                </div>
                <div className="w-1/6 text-center">{item.quantity}</div>
                <div className="w-1/3 text-right font-semibold">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal & Calculations */}
          <div className="border-t border-dashed border-stone-300 pt-2 space-y-1 text-[11px]">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-stone-900">₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Packing Charges ({order.totalItemsCount} × ₹5):</span>
              <span className="font-semibold text-stone-900">₹{order.packingCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>GST ({(order.gstRate * 100).toFixed(0)}%):</span>
              <span className="font-semibold text-stone-900">₹{order.gstAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Grand Total Bar */}
          <div className="border-t-2 border-b-2 border-stone-900 py-2 my-2 flex justify-between items-center text-stone-900 font-extrabold text-sm">
            <span>Total Amount</span>
            <span className="text-base font-bold">₹{order.grandTotal}</span>
          </div>

          {/* Footer note & Tax acknowledgement */}
          <div className="text-center pt-2 space-y-1 text-[10px] text-stone-500 font-sans">
            <p>ⓘ GST Rate: 5% (Inclusive in the total amount)</p>
            <p className="font-medium text-stone-700">Payment Mode: {order.paymentMethod}</p>
            <p className="text-xs font-bold text-stone-800 pt-2">
              Thank You! Visit Again! ❤️
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-xl bg-stone-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-black transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print Bill</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 px-3 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-brand-100 transition-colors border border-brand-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
