import React from 'react';
import { MapPin, Navigation, Phone, Clock, ExternalLink } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantInfo';
import { HariOmLogo } from './HariOmLogo';

export const LocationSection = () => {
  const googleMapsUrl = 'https://maps.app.goo.gl/FT9isZCy8gY2UDkN7';

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-2xs space-y-4 my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
            Visit Our Store in Coimbatore
          </span>
          <div className="flex items-center gap-2.5 pt-0.5">
            <HariOmLogo size="xs" />
            <h3 className="font-display font-extrabold text-lg sm:text-xl text-stone-900 tracking-tight">
              Hari Om Chaats & Snacks
            </h3>
          </div>
        </div>

        {/* Big High-Visibility "Get Directions" Button */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all active:scale-98 shrink-0"
        >
          <Navigation className="w-4 h-4" />
          <span>Get Directions</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700">
        {/* Address */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
          <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <strong className="block text-stone-900 font-bold mb-0.5">Address</strong>
            <p className="text-stone-600 leading-relaxed">
              196, Neel Complex, Raja Annamalai Road,<br />
              Saibaba Colony, Coimbatore, Tamil Nadu 641011
            </p>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <strong className="block text-stone-900 font-bold mb-0.5">Operating Hours</strong>
            <p className="text-stone-600 leading-relaxed">
              Every Day: 1:00 PM – 10:00 PM<br />
              <span className="text-emerald-700 font-semibold">Open for Dining & Takeaway</span>
            </p>
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <strong className="block text-stone-900 font-bold mb-0.5">Phone Orders</strong>
            <p className="text-stone-600 leading-relaxed font-mono">
              <a href="tel:9940169618" className="hover:text-brand-600">+91 99401 69618</a><br />
              <a href="tel:9600055167" className="hover:text-brand-600">+91 96000 55167</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
