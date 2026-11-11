import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { DesktopHeader } from '../components/DesktopHeader';
import { Hero } from '../components/Hero';
import { BottomNav } from '../components/BottomNav';
import { SideDrawer } from '../components/SideDrawer';
import { FoodCard } from '../components/FoodCard';
import { ItemDetailModal } from '../components/ItemDetailModal';
import { FixedCartBar } from '../components/FixedCartBar';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { OrderConfirmationModal } from '../components/OrderConfirmationModal';
import { OrderBillReceipt } from '../components/OrderBillReceipt';
import { RestaurantInfoModal } from '../components/RestaurantInfoModal';
import { HeroSlideshow } from '../components/HeroSlideshow';
import { LocationSection } from '../components/LocationSection';
import { HariOmLogo } from '../components/HariOmLogo';
import { MenuCategoriesView } from '../views/MenuCategoriesView';
import { CategoryListingView } from '../views/CategoryListingView';
import { OffersView } from '../views/OffersView';
import { OrdersView } from '../views/OrdersView';
import { AccountView } from '../views/AccountView';
import { MENU_ITEMS, CATEGORIES } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { useRestaurant } from '../context/RestaurantContext';
import { SearchX, Flame, ChevronRight, Plus, Star, Clock, ShoppingBag, Navigation } from 'lucide-react';

export function CustomerApp() {
  const { isCartOpen, setIsCartOpen, addToCart } = useCart();
  
  // Connect to shared restaurant data for live menu & categories updates
  let liveMenuItems = MENU_ITEMS;
  let liveCategories = CATEGORIES;
  try {
    const restaurant = useRestaurant();
    if (restaurant?.menuItems) liveMenuItems = restaurant.menuItems;
    if (restaurant?.categories) liveCategories = restaurant.categories;
  } catch {
    // Fallback if rendered outside provider
  }

  // Navigation State
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'menu' | 'offers' | 'orders' | 'account'
  const [selectedCategory, setSelectedCategory] = useState(null); // when in menu tab
  const [homeCategory, setHomeCategory] = useState('all'); // category filter on homepage
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [receiptOrder, setReceiptOrder] = useState(null);

  // Filtered menu items for homepage (hiding disabled items)
  const homeFilteredItems = useMemo(() => {
    return liveMenuItems.filter((item) => {
      if (item.enabled === false) return false;

      const matchesCategory =
        homeCategory === 'all' || item.category === homeCategory;

      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [liveMenuItems, homeCategory, searchQuery]);

  // Selected Category Object with its items (for Category detail listing)
  const categoryWithItems = useMemo(() => {
    if (!selectedCategory) return null;
    const cat = liveCategories.find((c) => c.id === selectedCategory);
    if (!cat) return null;
    return {
      ...cat,
      items: liveMenuItems.filter((i) => i.category === selectedCategory && i.enabled !== false),
    };
  }, [liveCategories, liveMenuItems, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* ========================================================= */}
      {/* 1. SEPARATE DESKTOP HEADER (Visible on md/lg screens) */}
      {/* ========================================================= */}
      <div className="hidden md:block">
        <DesktopHeader
          activeTab={activeTab}
          onSelectTab={(tabId) => {
            setActiveTab(tabId);
            setSelectedCategory(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenInfo={() => setIsInfoOpen(true)}
        />
      </div>

      {/* ========================================================= */}
      {/* 2. SEPARATE MOBILE HEADER (Visible on phone screens) */}
      {/* ========================================================= */}
      <div className="block md:hidden">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenDrawer={() => setIsSideDrawerOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
        />
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN CONTENT: DEDICATED MOBILE & DESKTOP PRESENTATION */}
      {/* ========================================================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-32 md:pb-16">
        {/* ================= TAB 1: HOME ================= */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Mobile View Hero: Compact phone version */}
            <div className="block md:hidden">
              {!searchQuery && (
                <Hero
                  activeCategory={homeCategory}
                  onSelectCategory={(catId) => setHomeCategory(catId)}
                  onOpenInfo={() => setIsInfoOpen(true)}
                  onSeeAllSpecials={() => setActiveTab('offers')}
                />
              )}
            </div>

            {/* Desktop View Hero: Automatic Image & Video Slideshow */}
            <div className="hidden md:block mb-6">
              {!searchQuery && (
                <HeroSlideshow
                  onOpenInfo={() => setIsInfoOpen(true)}
                  onExploreMenu={() => {
                    setActiveTab('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </div>

              {/* Desktop Category Filter Bar with Real Food Photos */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs mb-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setHomeCategory('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      homeCategory === 'all'
                        ? 'bg-brand-500 text-white shadow-2xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    All Dishes ({liveMenuItems.length})
                  </button>

                  {liveCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setHomeCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                        homeCategory === cat.id
                          ? 'bg-brand-500 text-white shadow-2xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-100'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-stone-200">
                        <img
                          src={cat.thumbnail || cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            {/* Menu Header */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight flex items-center gap-2">
                  <span>{searchQuery ? `Search Results for "${searchQuery}"` : 'Our Specialties'}</span>
                  {!searchQuery && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                      {homeFilteredItems.length} Dishes
                    </span>
                  )}
                </h2>
                <p className="text-xs text-stone-500">
                  {searchQuery
                    ? `Showing ${homeFilteredItems.length} matching chaats & snacks`
                    : 'Prepared fresh to order in Saibaba Colony, Coimbatore'}
                </p>
              </div>

              {!searchQuery && (
                <button
                  onClick={() => {
                    setActiveTab('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
                >
                  <span>Browse Categories</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>

            {/* Food Grid / List */}
            {homeFilteredItems.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-stone-200 p-8">
                <SearchX className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-display font-bold text-stone-800 text-base">
                  No delicious snacks found
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Try searching for "Pani Puri", "Sandwich", "Sev Puri" or check other categories.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setHomeCategory('all');
                  }}
                  className="mt-2 px-4 py-2 bg-brand-50 text-brand-600 text-xs font-bold rounded-xl hover:bg-brand-100"
                >
                  Reset filters & search
                </button>
              </div>
            ) : (
              <>
                {/* MOBILE VIEW: Single column vertical cards (Screen 01 format) */}
                <div className="block md:hidden space-y-3">
                  {homeFilteredItems.map((item) => (
                    <FoodCard
                      key={item.id}
                      item={item}
                      onOpenDetail={(product) => setSelectedDetailItem(product)}
                    />
                  ))}
                </div>

                {/* DESKTOP VIEW: Multi-Column Responsive Grid (3 to 4 columns) */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {homeFilteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedDetailItem(item)}
                      className="group bg-white rounded-2xl p-3.5 border border-stone-200/90 hover:border-brand-400 hover:shadow-card transition-all duration-200 cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        {/* Large High-Quality Food Photograph */}
                        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-stone-100 mb-3 border border-stone-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          {item.isBestSeller && (
                            <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                              POPULAR
                            </span>
                          )}
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{item.prepTime || '5m'}</span>
                          </span>
                        </div>

                        {/* Title & Category */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display font-extrabold text-stone-900 text-sm group-hover:text-brand-600 transition-colors">
                            {item.name}
                          </h4>
                          <span className="font-black text-sm text-stone-900 shrink-0">
                            ₹{item.price}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-medium block mt-0.5">
                          {item.categoryName}
                        </span>

                        {/* Description */}
                        <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
                          {item.description || 'Authentic preparation with crisp puran, sev, and fresh tangy mint water.'}
                        </p>
                      </div>

                      {/* Card Footer: Add button */}
                      <div className="pt-3 border-t border-stone-100 mt-3 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Pure Veg
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item, [], e.currentTarget);
                          }}
                          className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= TAB 2: MENU CATEGORIES ================= */}
        {activeTab === 'menu' && (
          <div>
            {selectedCategory && categoryWithItems ? (
              <CategoryListingView
                category={categoryWithItems}
                onBack={() => setSelectedCategory(null)}
                onOpenDetail={(product) => setSelectedDetailItem(product)}
              />
            ) : (
              <MenuCategoriesView
                onSelectCategory={(catId) => {
                  setSelectedCategory(catId);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        )}

        {/* ================= TAB 3: OFFERS / SPECIALS ================= */}
        {activeTab === 'offers' && (
          <div>
            <OffersView onOpenDetail={(product) => setSelectedDetailItem(product)} />
          </div>
        )}

        {/* ================= TAB 4: ORDERS & TRACKING ================= */}
        {activeTab === 'orders' && (
          <div>
            <OrdersView
              onOpenReceipt={(order) => setReceiptOrder(order)}
              onExploreMenu={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Location Section with Google Maps Directions */}
        {activeTab === 'home' && !searchQuery && (
          <LocationSection />
        )}

        {/* Global Footer with Google Maps Link & Store Details */}
        <footer className="mt-8 pt-6 pb-4 border-t border-stone-200/80 text-xs text-stone-500 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <HariOmLogo size="xs" />
              <span className="font-bold text-stone-800">Hari Om Chaats & Snacks</span>
              <span className="text-stone-300">•</span>
              <span>Saibaba Colony, Coimbatore</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://maps.app.goo.gl/FT9isZCy8gY2UDkN7"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Google Maps Directions</span>
              </a>
              <span className="text-stone-300">•</span>
              <a href="tel:9940169618" className="hover:text-stone-800">
                Ph: 9940169618
              </a>
            </div>
          </div>
          <div className="text-center sm:text-left text-[11px] text-stone-400">
            © {new Date().getFullYear()} Hari Om Chaats & Snacks • 100% Pure Vegetarian • 196, Neel Complex, Raja Annamalai Rd, Saibaba Colony
          </div>
        </footer>
      </main>

      {/* ========================================================= */}
      {/* 4. MOBILE-ONLY BOTTOM NAVIGATION & FIXED CART BAR */}
      {/* ========================================================= */}
      <div className="block md:hidden">
        {/* Floating Cart Bar (Screen 01 - Sticky bottom bar) */}
        <FixedCartBar onOpenCart={() => setIsCartOpen(true)} />

        {/* Bottom 5-Tab Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tabId) => {
            setActiveTab(tabId);
            setSelectedCategory(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>

      {/* ========================================================= */}
      {/* 5. MODALS & DRAWERS (Universal) */}
      {/* ========================================================= */}
      {/* Side Navigation Drawer */}
      <SideDrawer
        isOpen={isSideDrawerOpen}
        onClose={() => setIsSideDrawerOpen(false)}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      {/* Product Details Modal */}
      {selectedDetailItem && (
        <ItemDetailModal
          item={selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
        />
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={(order) => {
          setIsCheckoutOpen(false);
          setConfirmedOrder(order);
        }}
      />

      {/* Order Confirmation Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
          onOpenReceipt={(ord) => setReceiptOrder(ord)}
        />
      )}

      {/* Digital Receipt Modal */}
      {receiptOrder && (
        <OrderBillReceipt
          order={receiptOrder}
          onClose={() => setReceiptOrder(null)}
        />
      )}

      {/* Restaurant Info Modal */}
      <RestaurantInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </div>
  );
}

export default CustomerApp;
