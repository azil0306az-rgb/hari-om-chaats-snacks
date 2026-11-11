import React, { useState, useEffect, useRef } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ChevronLeft, ChevronRight, Pause, Play, MapPin, Clock, ArrowRight, Sparkles, Navigation } from 'lucide-react';

export const HeroSlideshow = ({ onOpenInfo, onExploreMenu }) => {
  const { heroSlides, settings } = useRestaurant();

  // Active enabled slides
  const activeSlides = (heroSlides || []).filter((s) => s.enabled !== false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const videoRef = useRef(null);
  const slideTimerRef = useRef(null);

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  // Reset video loaded state when index changes
  useEffect(() => {
    setIsVideoLoaded(false);
  }, [currentIndex]);

  // Handle slide timer and progression
  useEffect(() => {
    if (!isPlaying || !currentSlide) return;

    // If current slide is an image, set timeout based on slide duration
    if (currentSlide.type !== 'video') {
      const durationMs = (currentSlide.duration || 5) * 1000;
      slideTimerRef.current = setTimeout(() => {
        handleNext();
      }, durationMs);

      return () => clearTimeout(slideTimerRef.current);
    }
    // If it's a video, the video's onEnded or a fallback timeout will advance it
    const fallbackDurationMs = (currentSlide.duration || 6) * 1000;
    slideTimerRef.current = setTimeout(() => {
      handleNext();
    }, fallbackDurationMs);

    return () => clearTimeout(slideTimerRef.current);
  }, [currentIndex, isPlaying, currentSlide]);

  const handleNext = () => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  if (!currentSlide) return null;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-stone-900 shadow-card transition-all duration-300">
      {/* ========================================================= */}
      {/* 1. MEDIA LAYER (Images, Videos & Instant Poster Fallbacks) */}
      {/* ========================================================= */}
      <div className="relative w-full h-[220px] sm:h-[280px] md:h-[340px] lg:h-[380px] overflow-hidden">
        {/* Step 1 & Fallback: Immediate Poster Image */}
        <img
          src={currentSlide.posterUrl || currentSlide.mediaUrl}
          alt={currentSlide.heading}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            currentSlide.type === 'video' && isVideoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          loading="eager"
        />

        {/* Step 2 & 3: Background Video with AutoPlay */}
        {currentSlide.type === 'video' && (
          <video
            ref={videoRef}
            key={currentSlide.id}
            src={currentSlide.mediaUrl}
            poster={currentSlide.posterUrl}
            autoPlay
            muted
            playsInline
            loop={false}
            onLoadedData={() => setIsVideoLoaded(true)}
            onEnded={handleNext}
            onError={() => {
              // Graceful error fallback: keep showing the poster image
              setIsVideoLoaded(false);
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Multi-Stop Cinematic Gradients for Crisp Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/40 to-transparent" />
      </div>

      {/* ========================================================= */}
      {/* 2. OVERLAY TEXT & BRAND MESSAGING (Aligned Vertically & Horizontally) */}
      {/* ========================================================= */}
      <div className="absolute inset-0 p-5 sm:p-7 md:p-10 flex flex-col justify-end text-white z-10">
        <div className="max-w-xl space-y-2 sm:space-y-3">
          {/* Subtitle Badge with Perfect Spacing */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[11px] sm:text-xs font-bold tracking-wide">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{currentSlide.subtitle || 'Fresh • Tasty • Hygienic'}</span>
          </div>

          {/* Heading with Robust Typography & Contrast */}
          <h1 className="font-display text-xl sm:text-2xl md:text-3.5xl font-black text-white leading-tight drop-shadow-md">
            {currentSlide.heading || 'Authentic Chaats & Snacks in Coimbatore'}
          </h1>

          {/* Description (Visible on sm/md/lg viewports) */}
          {currentSlide.description && (
            <p className="text-stone-300 text-xs sm:text-sm line-clamp-2 max-w-lg leading-relaxed drop-shadow-sm hidden xs:block">
              {currentSlide.description}
            </p>
          )}

          {/* Action CTAs & Google Directions Shortcut */}
          <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2.5">
            {/* Primary CTA */}
            {currentSlide.ctaText && (
              <button
                onClick={() => {
                  if (currentSlide.ctaLink?.startsWith('http')) {
                    window.open(currentSlide.ctaLink, '_blank');
                  } else if (onExploreMenu) {
                    onExploreMenu();
                  }
                }}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 active:scale-98"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Direct Google Maps Directions Button */}
            <a
              href="https://maps.app.goo.gl/FT9isZCy8gY2UDkN7"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-stone-200 hover:text-white text-xs sm:text-sm font-bold backdrop-blur-md border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span>Get Directions</span>
            </a>

            {/* Timings info pill */}
            <button
              onClick={onOpenInfo}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-semibold backdrop-blur-md border border-white/10"
            >
              <Clock className="w-3 h-3 text-amber-300" />
              <span>1:00 PM – 10:00 PM</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MINIMAL CAROUSEL NAVIGATION CONTROLS */}
      {/* ========================================================= */}
      {activeSlides.length > 1 && (
        <>
          {/* Previous / Next Arrow Controls */}
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors z-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors z-20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Bottom Slide Indicator Dots & Play/Pause Button */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-6 flex items-center gap-2 z-20 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              className="text-stone-300 hover:text-white"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>

            <div className="flex items-center gap-1.5">
              {activeSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all rounded-full ${
                    currentIndex === idx
                      ? 'w-5 h-1.5 bg-brand-500'
                      : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlideshow;
