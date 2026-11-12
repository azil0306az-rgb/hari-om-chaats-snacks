import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, CheckCircle2, Clock, Calendar, MapPin, User, Phone, CreditCard, Smartphone, Building, Banknote, ShieldAlert } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/restaurantInfo';
import { HariOmLogo } from './HariOmLogo';

export const CheckoutModal = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cart, totalItemsCount, subtotal, packingCharges, gstRate, gstAmount, grandTotal, clearCart } = useCart();

  // Form State
  const [fullName, setFullName] = useState(() => localStorage.getItem('hariom_name') || '');
  const [phoneNumber, setPhoneNumber] = useState(() => localStorage.getItem('hariom_phone') || '');
  const [pickupMode, setPickupMode] = useState('asap'); // 'asap' | 'later'
  const [pickupDate, setPickupDate] = useState('today'); // 'today' | 'tomorrow'
  const [pickupTimeSlot, setPickupTimeSlot] = useState('17:30');
  const [paymentMethod, setPaymentMethod] = useState('counter'); // 'counter' | 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Generate 15-minute pickup time slots between 1:00 PM (13:00) and 10:00 PM (22:00)
  const timeSlots = [];
  for (let h = 13; h < 22; h++) {
    const formattedHour = h > 12 ? h - 12 : h;
    const ampm = h >= 12 ? 'PM' : 'AM';
    timeSlots.push({
      value: `${h}:00`,
      label: `${formattedHour}:00 ${ampm}`,
    });
    timeSlots.push({
      value: `${h}:30`,
      label: `${formattedHour}:30 ${ampm}`,
    });
  }

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phoneNumber = 'Please enter your 10-digit mobile number';
    } else if (cleanPhone.length !== 10) {
      newErrors.phoneNumber = 'Enter a valid 10-digit Indian phone number';
    }

    if (paymentMethod === 'upi' && !upiId.trim()) {
      newErrors.upiId = 'Enter a valid UPI ID (e.g. mobile@upi)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Save user info for future convenience
    localStorage.setItem('hariom_name', fullName);
    localStorage.setItem('hariom_phone', phoneNumber);

    // Simulate order submission delay
    setTimeout(() => {
      const orderId = `HO${Math.floor(1000 + Math.random() * 9000)}`;
      const orderData = {
        orderId,
        customerName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        orderType: 'Pickup (Takeaway)',
        pickupTiming:
          pickupMode === 'asap'
            ? 'As Soon As Possible (≈ 10-15 mins)'
            : `${pickupDate === 'today' ? 'Today' : 'Tomorrow'} at ${timeSlots.find((s) => s.value === pickupTimeSlot)?.label || pickupTimeSlot}`,
        items: [...cart],
        totalItemsCount,
        subtotal,
        packingCharges,
        gstRate,
        gstAmount,
        grandTotal,
        paymentMethod:
          paymentMethod === 'counter'
            ? 'Pay at Pickup Counter (Cash / UPI / Card)'
            : paymentMethod === 'upi'
            ? `UPI (${upiId || 'Direct UPI'})`
            : paymentMethod === 'card'
            ? 'Credit / Debit Card'
            : 'Net Banking',
        createdAt: new Date().toISOString(),
        status: 'Confirmed',
      };

      // Store in past orders history in localStorage
      try {
        const past = JSON.parse(localStorage.getItem('hariom_orders') || '[]');
        localStorage.setItem('hariom_orders', JSON.stringify([orderData, ...past]));
      } catch (err) {
        console.error(err);
      }

      setIsSubmitting(false);
      clearCart();
      onOrderPlaced(orderData);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 max-h-[92vh] flex flex-col animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/90">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white text-stone-600 hover:bg-stone-200 flex items-center justify-center border border-stone-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <HariOmLogo size="xs" />
            <div>
              <h2 className="font-display font-bold text-lg text-stone-900 leading-tight">
                Review & Checkout
              </h2>
              <span className="text-xs text-stone-500">
                196 Neel Complex, Saibaba Colony
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

        {/* Scrollable Form Body */}
        <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* 1. Order Type Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Order Type
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                className="p-3 rounded-2xl border-2 border-brand-500 bg-brand-50/40 text-left flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0">
                  🛍️
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-stone-900">Pickup</div>
                  <div className="text-[11px] text-stone-500">Takeaway from store</div>
                </div>
              </button>

              <button
                type="button"
                disabled
                className="p-3 rounded-2xl border border-stone-200 bg-stone-50 text-left flex items-center gap-2.5 opacity-60 cursor-not-allowed"
              >
                <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-600 flex items-center justify-center shrink-0">
                  🍽️
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-stone-800">Dine-In</div>
                  <div className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-1 rounded inline-block">
                    Coming Soon
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Restaurant Location Card */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-stone-900 text-sm">{RESTAURANT_INFO.name}</div>
              <p className="text-stone-600 mt-0.5 leading-snug">{RESTAURANT_INFO.address}</p>
              <div className="mt-1.5 flex items-center gap-2 text-stone-500">
                <span>Phone: <strong>{RESTAURANT_INFO.phone}</strong></span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">Daily 1 PM – 10 PM</span>
              </div>
            </div>
          </div>

          {/* 3. Customer Contact Details */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Customer Details
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 bg-stone-50 border rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-stone-200 focus:ring-brand-200'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Mobile Number *
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-stone-200 bg-stone-100 text-stone-700 font-semibold text-xs sm:text-sm">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-r-xl text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.phoneNumber ? 'border-red-500 focus:ring-red-200' : 'border-stone-200 focus:ring-brand-200'
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.phoneNumber}</p>
                )}
                <span className="text-[10px] text-stone-400 mt-1 block">
                  You'll receive pickup notifications & order updates.
                </span>
              </div>
            </div>
          </div>

          {/* 4. Pickup Scheduling */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Pickup Scheduling
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2.5">
              <button
                type="button"
                onClick={() => setPickupMode('asap')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  pickupMode === 'asap'
                    ? 'border-brand-500 bg-brand-50/50 text-brand-900 font-bold'
                    : 'border-stone-200 bg-stone-50/50 text-stone-600'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Clock className="w-3.5 h-3.5 text-brand-500" />
                  <span>As Soon As Possible</span>
                </div>
                <div className="text-[11px] text-stone-500 font-normal mt-0.5">
                  ≈ 10–15 mins prep time
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPickupMode('later')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  pickupMode === 'later'
                    ? 'border-brand-500 bg-brand-50/50 text-brand-900 font-bold'
                    : 'border-stone-200 bg-stone-50/50 text-stone-600'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-brand-500" />
                  <span>Schedule for Later</span>
                </div>
                <div className="text-[11px] text-stone-500 font-normal mt-0.5">
                  Choose date & time slot
                </div>
              </button>
            </div>

            {pickupMode === 'later' && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5 animate-fade-in">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPickupDate('today')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                      pickupDate === 'today' ? 'bg-brand-500 text-white' : 'bg-white border text-stone-700'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickupDate('tomorrow')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                      pickupDate === 'tomorrow' ? 'bg-brand-500 text-white' : 'bg-white border text-stone-700'
                    }`}
                  >
                    Tomorrow
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Select Pickup Time Slot (1:00 PM – 10:00 PM)
                  </label>
                  <select
                    value={pickupTimeSlot}
                    onChange={(e) => setPickupTimeSlot(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 5. Payment Selection (Frontend Simulation Only) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Payment Method
              </label>
              <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                Simulation Demo
              </span>
            </div>

            <div className="space-y-2">
              {/* Option 1: Pay at Pickup */}
              <label
                onClick={() => setPaymentMethod('counter')}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'counter'
                    ? 'border-brand-500 bg-brand-50/40 text-stone-900 ring-1 ring-brand-400'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'counter'}
                  onChange={() => setPaymentMethod('counter')}
                  className="mt-1 text-brand-600 focus:ring-brand-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      Pay at Pickup Counter
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Popular
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Pay by Cash, Google Pay, PhonePe, or Card when collecting your food at the counter.
                  </p>
                </div>
              </label>

              {/* Option 2: UPI */}
              <label
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-brand-500 bg-brand-50/40 text-stone-900 ring-1 ring-brand-400'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="mt-1 text-brand-600 focus:ring-brand-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-brand-600" />
                      UPI (GPay / PhonePe / Paytm / QR)
                    </span>
                    <span className="text-[10px] text-stone-500">Instant</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Fast & zero-touch payment via any UPI app.
                  </p>

                  {paymentMethod === 'upi' && (
                    <div className="mt-2.5 pt-2 border-t border-brand-200/50">
                      <input
                        type="text"
                        placeholder="yourname@okhdfcbank or 9940169618@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      {errors.upiId && (
                        <p className="text-[10px] text-red-500 mt-1">{errors.upiId}</p>
                      )}
                    </div>
                  )}
                </div>
              </label>

              {/* Option 3: Card */}
              <label
                onClick={() => setPaymentMethod('card')}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-brand-500 bg-brand-50/40 text-stone-900 ring-1 ring-brand-400'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mt-1 text-brand-600 focus:ring-brand-500"
                />
                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    Credit / Debit Card (Visa, RuPay, Mastercard)
                  </span>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Simulated card authorization demonstration.
                  </p>
                </div>
              </label>

              {/* Option 4: Net Banking */}
              <label
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-brand-500 bg-brand-50/40 text-stone-900 ring-1 ring-brand-400'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'netbanking'}
                  onChange={() => setPaymentMethod('netbanking')}
                  className="mt-1 text-brand-600 focus:ring-brand-500"
                />
                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-purple-600" />
                    Net Banking
                  </span>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    HDFC, SBI, ICICI, Axis, Canara & all Indian banks.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 6. Order Breakdown Review */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
            <div className="font-bold text-stone-800 text-sm mb-1">
              Order Summary ({totalItemsCount} items)
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Items Total</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Packing Charges ({totalItemsCount} × ₹5)</span>
              <span className="font-medium">₹{packingCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>GST ({(gstRate * 100).toFixed(0)}%)</span>
              <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-extrabold text-stone-900">
              <span>Grand Total</span>
              <span className="text-base text-brand-600 font-display">₹{grandTotal}</span>
            </div>
          </div>
        </form>

        {/* Submit Button */}
        <div className="p-4 bg-white border-t border-stone-200 safe-pb">
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-700 hover:to-amber-600 active:scale-98 text-white font-display font-bold text-base shadow-lg shadow-brand-500/25 flex items-center justify-between transition-all disabled:opacity-60"
          >
            <span>{isSubmitting ? 'Confirming Order...' : 'Place Order'}</span>
            <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-xl">
              <span>₹{grandTotal}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
