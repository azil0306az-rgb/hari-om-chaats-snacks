import React, { useState } from 'react';
import { User, Phone, MapPin, Clock, ShieldCheck, Heart, Sparkles, ExternalLink, HelpCircle, Navigation } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantInfo';
import { HariOmLogo } from '../components/HariOmLogo';

export const AccountView = () => {
  const [name, setName] = useState(() => localStorage.getItem('hariom_name') || 'Guest Foodie');
  const [phone, setPhone] = useState(() => localStorage.getItem('hariom_phone') || '9876543210');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('hariom_name', name);
    localStorage.setItem('hariom_phone', phone);
    setIsEditing(false);
  };

  return (
    <div className="px-4 py-4 space-y-4 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight">
          My Account & Store
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Manage your takeaway profile and connect with Hari Om Chaats
        </p>
      </div>

      {/* User Profile Card */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center font-display font-bold text-lg shadow-sm">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-base text-stone-900 truncate">
              {name}
            </h3>
            <p className="text-xs text-stone-500 font-mono">
              +91 {phone}
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSave} className="mt-4 pt-3 border-t border-stone-100 space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-brand-500 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-brand-600 transition-colors"
            >
              Save Profile
            </button>
          </form>
        )}
      </div>

      {/* Store Location Card matching Section 7 */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-soft space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <HariOmLogo size="xs" />
          <div>
            <h4 className="font-display font-bold text-sm text-stone-900 leading-tight">
              {RESTAURANT_INFO.name}
            </h4>
            <span className="text-[11px] text-amber-700 font-semibold">
              {RESTAURANT_INFO.subtitle}
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2.5 text-xs text-stone-700">
          <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-stone-900">Address:</span>
            <p className="text-stone-600 mt-0.5 leading-relaxed">
              {RESTAURANT_INFO.address}
            </p>
            <a
              href="https://maps.app.goo.gl/FT9isZCy8gY2UDkN7"
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 font-bold text-xs text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200 hover:bg-brand-100 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Driving Directions (Google Maps)</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-start gap-2.5 text-xs text-stone-700">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-stone-900">Store Hours:</span>
            <p className="text-stone-600 mt-0.5">
              Every day: <strong className="text-stone-900">{RESTAURANT_INFO.hours}</strong>
            </p>
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="flex items-start gap-2.5 text-xs text-stone-700">
          <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-stone-900">Direct Contact:</span>
            <div className="mt-1 flex flex-wrap gap-2">
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 inline-flex items-center gap-1 hover:bg-emerald-100"
              >
                <Phone className="w-3 h-3" />
                <span>{RESTAURANT_INFO.displayPhone}</span>
              </a>
              <a
                href={`tel:${RESTAURANT_INFO.alternatePhone}`}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 inline-flex items-center gap-1 hover:bg-emerald-100"
              >
                <Phone className="w-3 h-3" />
                <span>{RESTAURANT_INFO.displayAlternatePhone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Instagram */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
          <span className="text-stone-600 flex items-center gap-1.5 font-medium">
            <svg className="w-4 h-4 text-pink-600 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Follow us on Instagram:
          </span>
          <a
            href="https://instagram.com/hariomchaatssnacks"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-brand-600 hover:underline"
          >
            @{RESTAURANT_INFO.instagram}
          </a>
        </div>
      </div>

      {/* Bulk & Party Orders Notice matching menu footer */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Bulk & Party Orders Accepted</span>
        </div>
        <p className="text-[11px] text-amber-800/90 leading-relaxed">
          Hosting a birthday, family gathering or corporate party? Call <strong>{RESTAURANT_INFO.phone}</strong> for fresh live chaat counters and custom party trays.
        </p>
      </div>
    </div>
  );
};
