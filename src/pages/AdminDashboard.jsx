import React, { useState, useMemo, useRef } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { HariOmLogo } from '../components/HariOmLogo';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Receipt,
  Users,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Printer,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Check,
  X,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  UserCheck,
  ShieldAlert,
  Save,
  Eye,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Link,
  Sparkles,
  Smartphone,
  Monitor,
  Film,
  SlidersHorizontal,
  Layers,
  Tag,
  Grid,
  FileText,
  Navigation,
  Lock,
  ArrowUpDown,
  Play
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemStatus,
    togglePOSVisibility,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    settings,
    updateSettings,
    heroSlides,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    reorderHeroSlides,
    bills,
    onlineOrders,
    updateOnlineOrderStatus,
    staff,
    addStaffMember,
    currentUser,
    setCurrentUser,
  } = useRestaurant();

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ----------------------------------------------------
  // MENU MANAGEMENT STATE
  // ----------------------------------------------------
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedMenuCategory, setSelectedMenuCategory] = useState('all');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [previewTab, setPreviewTab] = useState('customer'); // 'customer' | 'pos'
  const fileInputRef = useRef(null);

  const [itemFormData, setItemFormData] = useState({
    name: '',
    category: 'chaat',
    categoryName: 'Chaats',
    price: '',
    prepTime: '5-8 mins',
    description: '',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    isBestSeller: false,
    enabled: true,
    posVisible: true,
  });

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCat =
        selectedMenuCategory === 'all' || item.category === selectedMenuCategory;
      const matchesSearch =
        !menuSearch.trim() ||
        item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
        item.categoryName?.toLowerCase().includes(menuSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [menuItems, selectedMenuCategory, menuSearch]);

  const handleOpenAddItem = () => {
    setEditingItem(null);
    setItemFormData({
      name: '',
      category: categories[0]?.id || 'chaat',
      categoryName: categories[0]?.name || 'Chaats',
      price: '',
      prepTime: '5-8 mins',
      description: '',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      isBestSeller: false,
      enabled: true,
      posVisible: true,
    });
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item) => {
    setEditingItem(item);
    setItemFormData({
      name: item.name,
      category: item.category,
      categoryName: item.categoryName,
      price: item.price,
      prepTime: item.prepTime || '5-8 mins',
      description: item.description || '',
      image: item.image || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      isBestSeller: !!item.isBestSeller,
      enabled: item.enabled !== false,
      posVisible: item.posVisible !== false,
    });
    setIsItemModalOpen(true);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/)) {
      alert('Please select a valid image file (JPG, PNG, or WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setItemFormData((prev) => ({
        ...prev,
        image: loadEvent.target.result,
      }));
      showToast('Image uploaded successfully! Preview updated.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!itemFormData.name.trim() || !itemFormData.price) {
      alert('Please fill in required fields (Name and Price)');
      return;
    }
    const catObj = categories.find((c) => c.id === itemFormData.category);
    const payload = {
      ...itemFormData,
      name: itemFormData.name.trim(),
      categoryName: catObj ? catObj.name : itemFormData.categoryName,
      price: Number(itemFormData.price),
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, payload);
      showToast(`Updated "${payload.name}" successfully!`);
    } else {
      addMenuItem(payload);
      showToast(`Added "${payload.name}" to menu!`);
    }
    setIsItemModalOpen(false);
  };

  // ----------------------------------------------------
  // HERO SECTION SLIDES MANAGEMENT
  // ----------------------------------------------------
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [heroForm, setHeroForm] = useState({
    type: 'image',
    heading: '',
    subtitle: '',
    description: '',
    mediaUrl: '',
    mobileMediaUrl: '',
    posterUrl: '',
    ctaText: 'Explore Menu',
    ctaLink: '#menu',
    duration: 5,
    enabled: true,
  });

  const handleOpenAddSlide = () => {
    setEditingSlide(null);
    setHeroForm({
      type: 'image',
      heading: 'Saibaba Colony Special Delicacies',
      subtitle: 'Fresh • Tasty • Pure Veg',
      description: 'Handcrafted with authentic spices and fresh puran.',
      mediaUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
      mobileMediaUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      posterUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      ctaText: 'Explore Menu',
      ctaLink: '#menu',
      duration: 5,
      enabled: true,
    });
    setIsHeroModalOpen(true);
  };

  const handleOpenEditSlide = (slide) => {
    setEditingSlide(slide);
    setHeroForm({ ...slide });
    setIsHeroModalOpen(true);
  };

  const handleSaveHeroSlide = (e) => {
    e.preventDefault();
    if (!heroForm.heading.trim() || !heroForm.mediaUrl) {
      alert('Heading and Media URL are required');
      return;
    }
    if (editingSlide) {
      updateHeroSlide(editingSlide.id, heroForm);
      showToast('Hero slide updated successfully!');
    } else {
      addHeroSlide(heroForm);
      showToast('New hero slide added to homepage slideshow!');
    }
    setIsHeroModalOpen(false);
  };

  // ----------------------------------------------------
  // CATEGORIES MANAGEMENT STATE
  // ----------------------------------------------------
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', description: '', image: '', thumbnail: '' });

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    addCategory({
      name: catForm.name.trim(),
      description: catForm.description.trim() || 'Delicious fresh preparation',
      image: catForm.image || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      thumbnail: catForm.thumbnail || catForm.image || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=160&q=80',
    });
    setIsCatModalOpen(false);
    setCatForm({ name: '', description: '', image: '', thumbnail: '' });
    showToast(`Added category ${catForm.name}!`);
  };

  // ----------------------------------------------------
  // POS SETTINGS & TABLES MANAGEMENT
  // ----------------------------------------------------
  const [posConfigForm, setPosConfigForm] = useState({
    defaultGstRate: settings.defaultGstRate || 0.05,
    packingChargePerItem: settings.packingChargePerItem || 5,
    billPrefix: settings.billPrefix || 'HO-POS-',
    thermalWidth: settings.thermalWidth || '80mm',
    defaultPaymentMethod: settings.defaultPaymentMethod || 'Cash',
    allowOperatorCancel: settings.allowOperatorCancel || false,
    allowOperatorReprint: settings.allowOperatorReprint !== false,
    showGstOnReceipt: settings.showGstOnReceipt !== false,
    showOnlineOrdersOnPOS: settings.showOnlineOrdersOnPOS !== false,
    tables: settings.tables || ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'],
  });

  const [newTableInput, setNewTableInput] = useState('');

  const handleSavePOSConfig = (e) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      ...posConfigForm,
    });
    showToast('Billing POS Configuration Saved!');
  };

  // ----------------------------------------------------
  // WEBSITE HOMEPAGE & STORE SETTINGS
  // ----------------------------------------------------
  const [storeSettingsForm, setStoreSettingsForm] = useState({ ...settings });

  const handleSaveStoreSettings = (e) => {
    e.preventDefault();
    updateSettings(storeSettingsForm);
    showToast('Store & Website details saved!');
  };

  // Metrics
  const completedBills = bills.filter((b) => b.status === 'Completed');
  const cancelledBills = bills.filter((b) => b.status === 'Cancelled');
  const posSales = completedBills.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const onlineSales = onlineOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const totalSales = posSales + onlineSales;
  const totalOrdersCount = completedBills.length + onlineOrders.length;
  const totalCancelledLoss = cancelledBills.reduce((sum, b) => sum + (b.grandTotal || 0), 0);

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col bg-[#F8F6F0] font-sans selection:bg-brand-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER (Fixed at top of screen) */}
      <header className="bg-white border-b border-stone-200 px-6 py-2.5 shrink-0 z-30 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <HariOmLogo size="xs" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-stone-900 tracking-tight text-base">
                  ADMIN DASHBOARD
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  Saibaba Colony
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium">
                Restaurant Management & Operations Control
              </p>
            </div>
          </div>
        </div>

        {/* Center: Google Maps Quick Link */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <a
            href="https://maps.app.goo.gl/FT9isZCy8gY2UDkN7"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-200 font-bold transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-brand-500" />
            <span>Store Maps: 196 Neel Complex</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs border border-stone-200 transition-colors"
          >
            <span>Customer Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="/billing"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-2xs transition-colors"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Open Billing POS</span>
          </a>

          {/* Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
            <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
              {currentUser.username.substring(0, 2)}
            </div>
            <div className="hidden xl:block text-left text-xs leading-tight">
              <p className="font-bold text-stone-900">{currentUser.name}</p>
              <p className="text-[10px] text-brand-600 font-semibold uppercase">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* BODY WITH STATIC/FIXED LEFT SIDEBAR & INDEPENDENT MAIN SCROLL */}
      {/* ========================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* STATIC/FIXED LEFT SIDEBAR (Never scrolls with main page) */}
        <aside className="w-64 h-full shrink-0 overflow-y-auto bg-white border-r border-stone-200 flex flex-col justify-between scrollbar-thin">
          <nav className="p-3.5 space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Operations
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'overview'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'orders'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Online Orders</span>
              </div>
              {onlineOrders.length > 0 && (
                <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'}`}>
                  {onlineOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('bills')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'bills'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 shrink-0" />
                <span>POS Bills History</span>
              </div>
              <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${activeTab === 'bills' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'}`}>
                {bills.length}
              </span>
            </button>

            <div className="pt-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Menu & Catalog
            </div>

            <button
              onClick={() => setActiveTab('menu')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'menu'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UtensilsCrossed className="w-4 h-4 shrink-0" />
                <span>Menu Items ({menuItems.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'categories'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Grid className="w-4 h-4 shrink-0" />
                <span>Categories ({categories.length})</span>
              </div>
            </button>

            <div className="pt-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Website Management
            </div>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'hero'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Film className="w-4 h-4 shrink-0" />
                <span>Hero Section & Slides</span>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                {heroSlides.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('website')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'website'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Homepage & Appearance</span>
            </button>

            <div className="pt-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Setup & Settings
            </div>

            <button
              onClick={() => setActiveTab('pos-settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'pos-settings'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 shrink-0" />
              <span>POS Settings & Tables</span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'staff'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Staff Accounts</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'reports'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Reports & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'settings'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Store & Contact Info</span>
            </button>
          </nav>

          {/* Bottom Sidebar: Location summary */}
          <div className="p-3 border-t border-stone-200 bg-stone-50 text-[11px] text-stone-600 space-y-1">
            <div className="font-bold text-stone-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="truncate">Saibaba Colony, CBE</span>
            </div>
            <a
              href="https://maps.app.goo.gl/FT9isZCy8gY2UDkN7"
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 font-bold hover:underline block"
            >
              Open Google Maps →
            </a>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* INDEPENDENTLY SCROLLING MAIN CONTENT WORKSPACE */}
        {/* ========================================================= */}
        <main className="flex-1 h-full overflow-y-auto p-6 max-w-7xl w-full scrollbar-thin">
          {/* ------------------------------------------------------- */}
          {/* TAB 1: OVERVIEW */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight">
                  Business Performance Overview
                </h1>
                <p className="text-sm text-stone-500">
                  Real-time sales, order breakdown, and operations summary for Hari Om Chaats & Snacks.
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Net Sales</span>
                  <div className="text-2xl font-black text-stone-900">₹{totalSales.toLocaleString('en-IN')}</div>
                  <span className="text-xs text-emerald-600 font-semibold">POS + Online Orders</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Orders</span>
                  <div className="text-2xl font-black text-stone-900">{totalOrdersCount}</div>
                  <span className="text-xs text-stone-500">{completedBills.length} In-store, {onlineOrders.length} Web</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">POS Sales</span>
                  <div className="text-2xl font-black text-amber-600">₹{posSales.toLocaleString('en-IN')}</div>
                  <span className="text-xs text-stone-500">{completedBills.length} Dining & Counter</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Online Pickup</span>
                  <div className="text-2xl font-black text-blue-600">₹{onlineSales.toLocaleString('en-IN')}</div>
                  <span className="text-xs text-stone-500">{onlineOrders.length} Customer Orders</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Cancelled Bills</span>
                  <div className="text-2xl font-black text-rose-600">{cancelledBills.length}</div>
                  <span className="text-xs text-rose-500 font-semibold">-₹{totalCancelledLoss} voided</span>
                </div>
              </div>

              {/* Quick Jump Banner */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-brand-500 rounded-3xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-extrabold text-lg">
                    Restaurant POS & Hero Content Management
                  </h3>
                  <p className="text-amber-100 text-xs sm:text-sm">
                    Manage real-time dining tables, rapid item lookup, and configure the homepage automatic slideshow.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <a
                    href="/billing"
                    className="px-4 py-2 bg-white text-stone-900 font-extrabold text-xs rounded-xl shadow-xs hover:bg-stone-100"
                  >
                    Open Billing POS
                  </a>
                  <button
                    onClick={() => setActiveTab('hero')}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl border border-white/20"
                  >
                    Manage Hero Slideshow
                  </button>
                </div>
              </div>

              {/* Recent Online Orders & POS Bills */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-stone-900 text-sm">Recent POS Bills</h3>
                    <button onClick={() => setActiveTab('bills')} className="text-xs font-bold text-brand-600">
                      View All →
                    </button>
                  </div>
                  <div className="divide-y divide-stone-100 text-xs">
                    {bills.slice(0, 4).map((b) => (
                      <div key={b.billNo} className="py-2.5 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-stone-900">{b.billNo} • {b.tableNo}</div>
                          <span className="text-stone-400">{b.customerName} • {b.paymentMethod}</span>
                        </div>
                        <div className="text-right font-black text-stone-900">₹{b.grandTotal}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-stone-900 text-sm">Recent Online Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-brand-600">
                      View All →
                    </button>
                  </div>
                  <div className="divide-y divide-stone-100 text-xs">
                    {onlineOrders.slice(0, 4).map((o) => (
                      <div key={o.orderId} className="py-2.5 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-stone-900">#{o.orderId} • {o.customerName}</div>
                          <span className="text-amber-700 font-semibold">{o.status}</span>
                        </div>
                        <div className="text-right font-black text-stone-900">₹{o.grandTotal}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 2: HERO SECTION & AUTOMATIC IMAGE/VIDEO SLIDESHOW */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight">
                    Hero Section Slideshow Management
                  </h1>
                  <p className="text-sm text-stone-500">
                    Control homepage carousel slides, upload images and promotional videos, and set automatic playback durations.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddSlide}
                  className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Hero Slide</span>
                </button>
              </div>

              {/* Slides Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs p-4 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* Media Preview Box */}
                      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-900 mb-3 border border-stone-200">
                        {slide.type === 'video' ? (
                          <div className="relative w-full h-full">
                            <img
                              src={slide.posterUrl || slide.mediaUrl}
                              alt={slide.heading}
                              className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <span className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg">
                                <Play className="w-5 h-5 fill-white ml-0.5" />
                              </span>
                            </div>
                            <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Film className="w-3 h-3" /> VIDEO
                            </span>
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            <img
                              src={slide.mediaUrl}
                              alt={slide.heading}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" /> IMAGE
                            </span>
                          </div>
                        )}

                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{slide.duration || 5}s Duration</span>
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                          Slide #{index + 1} • {slide.subtitle || 'Fresh • Tasty'}
                        </span>
                        <h3 className="font-display font-extrabold text-stone-900 text-base">
                          {slide.heading}
                        </h3>
                        <p className="text-xs text-stone-500 line-clamp-2">
                          {slide.description || 'Homepage hero promotional banner'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          updateHeroSlide(slide.id, { enabled: slide.enabled === false ? true : false });
                          showToast(`Slide ${slide.enabled === false ? 'Enabled' : 'Disabled'}`);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          slide.enabled !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {slide.enabled !== false ? 'Live on Home' : 'Disabled'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditSlide(slide)}
                          className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl"
                          title="Edit Slide"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this hero slide?')) {
                              deleteHeroSlide(slide.id);
                              showToast('Deleted hero slide');
                            }
                          }}
                          className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 3: MENU ITEMS (Full CRUD & Photo Controller) */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight">
                    Food Items & Pricing Management
                  </h1>
                  <p className="text-sm text-stone-500">
                    Add new dishes, upload photos, set prep times, and toggle web and POS availability.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddItem}
                  className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Food Item</span>
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search menu items..."
                    className="w-full pl-9 pr-3 py-1.5 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-0.5">
                  <button
                    onClick={() => setSelectedMenuCategory('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                      selectedMenuCategory === 'all' ? 'bg-brand-500 text-white' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    All ({menuItems.length})
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedMenuCategory(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                        selectedMenuCategory === c.id ? 'bg-brand-500 text-white' : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-500 uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Dish</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Prep Time</th>
                        <th className="py-3 px-4">Web Status</th>
                        <th className="py-3 px-4">POS Visibility</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredMenuItems.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50/70">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                  <span>{item.name}</span>
                                  {item.isBestSeller && (
                                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 rounded">
                                      Special
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-stone-400 line-clamp-1">{item.description}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-stone-100 px-2 py-0.5 rounded text-xs font-semibold text-stone-700">
                              {item.categoryName}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-black text-stone-900">₹{item.price}</td>
                          <td className="py-3 px-4 text-stone-500 font-medium">{item.prepTime || '5m'}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleMenuItemStatus(item.id)}
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                item.enabled !== false
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {item.enabled !== false ? 'Live' : 'Hidden'}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => togglePOSVisibility(item.id)}
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                item.posVisible !== false ? 'bg-amber-50 text-amber-800' : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              {item.posVisible !== false ? 'POS Shown' : 'POS Hidden'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditItem(item)}
                              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${item.name}"?`)) {
                                  deleteMenuItem(item.id);
                                  showToast(`Deleted ${item.name}`);
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 4: CATEGORIES MANAGEMENT */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight">
                    Food Categories Management
                  </h1>
                  <p className="text-sm text-stone-500">
                    Add new food categories with authentic photography thumbnails and manage menu grouping.
                  </p>
                </div>
                <button
                  onClick={() => setIsCatModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex items-center gap-3.5 justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cat.thumbnail || cat.image}
                        alt={cat.name}
                        className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-display font-bold text-stone-900 text-sm">{cat.name}</h4>
                        <p className="text-xs text-stone-500 line-clamp-1">{cat.description}</p>
                        <span className="text-[10px] font-semibold text-brand-600 mt-1 block">
                          {menuItems.filter((m) => m.category === cat.id).length} Dishes inside
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 5: WEBSITE HOMEPAGE & PROMOTIONAL ANNOUNCEMENTS */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'website' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight">
                  Homepage Content & Appearance Control
                </h1>
                <p className="text-sm text-stone-500">
                  Update homepage titles, notice banners, section visibility, and branding preferences.
                </p>
              </div>

              <form onSubmit={handleSaveStoreSettings} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-stone-900 text-sm uppercase tracking-wider pb-2 border-b border-stone-100">
                    Homepage Messaging
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Primary Headline
                    </label>
                    <input
                      type="text"
                      value={storeSettingsForm.tagline}
                      onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, tagline: e.target.value })}
                      className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={storeSettingsForm.subtitle}
                      onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Store Notice / Announcement Bar
                    </label>
                    <textarea
                      rows={2}
                      value={storeSettingsForm.notice}
                      onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, notice: e.target.value })}
                      className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Homepage Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 6: ONLINE ORDERS QUEUE */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight">
                  Online Takeaway Orders Queue
                </h1>
                <p className="text-sm text-stone-500">
                  Live web orders placed for pickup at Saibaba Colony counter.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {onlineOrders.map((order) => (
                  <div key={order.orderId} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-2xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-stone-400">Order ID</span>
                        <h4 className="font-mono font-black text-base text-stone-900">#{order.orderId}</h4>
                      </div>
                      <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                        {order.status}
                      </span>
                    </div>

                    <div className="bg-stone-50 p-2.5 rounded-xl text-xs space-y-1">
                      <p className="font-bold text-stone-900">{order.customerName}</p>
                      <p className="text-stone-500 font-mono">{order.customerPhone || order.phoneNumber}</p>
                      <p className="text-brand-600 font-medium">Pickup: {order.pickupTiming || order.pickupSlot || 'ASAP'}</p>
                    </div>

                    <div className="text-xs space-y-1">
                      {order.items?.map((it, i) => (
                        <div key={i} className="flex justify-between text-stone-700">
                          <span>{it.quantity} × {it.name}</span>
                          <span className="font-bold">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex justify-between font-bold text-xs">
                      <span>Total: ₹{order.grandTotal}</span>
                      <span className="text-stone-500">{order.paymentMethod}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-2">
                      <button
                        onClick={() => {
                          updateOnlineOrderStatus(order.orderId, 'Preparing');
                          showToast(`Order #${order.orderId} Preparing`);
                        }}
                        className="py-1 bg-amber-500 text-white rounded text-[11px] font-bold"
                      >
                        Preparing
                      </button>
                      <button
                        onClick={() => {
                          updateOnlineOrderStatus(order.orderId, 'Ready for Pickup');
                          showToast(`Order #${order.orderId} Ready`);
                        }}
                        className="py-1 bg-blue-500 text-white rounded text-[11px] font-bold"
                      >
                        Ready
                      </button>
                      <button
                        onClick={() => {
                          updateOnlineOrderStatus(order.orderId, 'Completed');
                          showToast(`Order #${order.orderId} Completed`);
                        }}
                        className="py-1 bg-emerald-600 text-white rounded text-[11px] font-bold"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 7: POS BILLS HISTORY */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'bills' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight">
                    In-Store POS Bills Record
                  </h1>
                  <p className="text-sm text-stone-500">
                    Full audit history of generated thermal tickets and cancellations.
                  </p>
                </div>
                <a
                  href="/billing"
                  className="px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Open POS
                </a>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4">Bill No</th>
                      <th className="py-2.5 px-4">Time</th>
                      <th className="py-2.5 px-4">Table / Counter</th>
                      <th className="py-2.5 px-4">Guest</th>
                      <th className="py-2.5 px-4">Total</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {bills.map((b) => (
                      <tr key={b.billNo} className={b.status === 'Cancelled' ? 'bg-rose-50/30' : ''}>
                        <td className="py-2.5 px-4 font-mono font-bold text-stone-900">{b.billNo}</td>
                        <td className="py-2.5 px-4 text-stone-500">
                          {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-2.5 px-4 font-semibold">{b.tableNo}</td>
                        <td className="py-2.5 px-4">{b.customerName || 'Walk-in'}</td>
                        <td className="py-2.5 px-4 font-black">₹{b.grandTotal}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              b.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 8: POS SETTINGS & TABLE CONFIGURATION */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'pos-settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight">
                  Billing POS Configuration & Tables
                </h1>
                <p className="text-sm text-stone-500">
                  Configure thermal printer paper width, tax rates, dining tables, and operator permissions.
                </p>
              </div>

              <form onSubmit={handleSavePOSConfig} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
                {/* Billing Configuration */}
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-stone-900 text-sm uppercase tracking-wider pb-2 border-b border-stone-100">
                    Receipt & Paper Setup
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Thermal Paper Width
                      </label>
                      <select
                        value={posConfigForm.thermalWidth}
                        onChange={(e) => setPosConfigForm({ ...posConfigForm, thermalWidth: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold"
                      >
                        <option value="80mm">80mm Standard POS Thermal Paper</option>
                        <option value="58mm">58mm Compact Mobile Thermal Paper</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Default GST Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={posConfigForm.defaultGstRate * 100}
                        onChange={(e) =>
                          setPosConfigForm({ ...posConfigForm, defaultGstRate: Number(e.target.value) / 100 })
                        }
                        className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Takeaway Packing Charge per Item (₹)
                      </label>
                      <input
                        type="number"
                        value={posConfigForm.packingChargePerItem}
                        onChange={(e) =>
                          setPosConfigForm({ ...posConfigForm, packingChargePerItem: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Bill Number Prefix
                      </label>
                      <input
                        type="text"
                        value={posConfigForm.billPrefix}
                        onChange={(e) => setPosConfigForm({ ...posConfigForm, billPrefix: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Table Management */}
                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <h3 className="font-display font-bold text-stone-900 text-sm uppercase tracking-wider pb-1">
                    Dining Table Setup
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {posConfigForm.tables.map((tbl) => (
                      <div
                        key={tbl}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold border border-stone-200"
                      >
                        <span>{tbl}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPosConfigForm({
                              ...posConfigForm,
                              tables: posConfigForm.tables.filter((t) => t !== tbl),
                            });
                          }}
                          className="text-stone-400 hover:text-rose-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTableInput}
                      onChange={(e) => setNewTableInput(e.target.value)}
                      placeholder="Add table name (e.g. Table 6, AC Hall 1)..."
                      className="flex-1 px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-200 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newTableInput.trim()) return;
                        if (!posConfigForm.tables.includes(newTableInput.trim())) {
                          setPosConfigForm({
                            ...posConfigForm,
                            tables: [...posConfigForm.tables, newTableInput.trim()],
                          });
                          setNewTableInput('');
                        }
                      }}
                      className="px-4 py-1.5 bg-brand-500 text-white rounded-xl text-xs font-bold"
                    >
                      Add Table
                    </button>
                  </div>
                </div>

                {/* Permissions & Security */}
                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <h3 className="font-display font-bold text-stone-900 text-sm uppercase tracking-wider pb-1">
                    Cashier Permissions
                  </h3>

                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={posConfigForm.allowOperatorCancel}
                        onChange={(e) =>
                          setPosConfigForm({ ...posConfigForm, allowOperatorCancel: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-brand-600"
                      />
                      <span className="font-semibold text-stone-800">
                        Allow POS operators to cancel bills without Admin authorization
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={posConfigForm.showOnlineOrdersOnPOS}
                        onChange={(e) =>
                          setPosConfigForm({ ...posConfigForm, showOnlineOrdersOnPOS: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-brand-600"
                      />
                      <span className="font-semibold text-stone-800">
                        Show live online takeaway orders queue inside Billing POS
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save POS Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 9: STAFF ACCOUNTS */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight">
                    Staff & Cashier Directory
                  </h1>
                  <p className="text-sm text-stone-500">
                    Manage billing operators, cashier usernames, and administrative access privileges.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Username</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4 text-right">Login Simulation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {staff.map((m) => (
                      <tr key={m.id} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4 font-bold text-stone-900">{m.name}</td>
                        <td className="py-3 px-4 font-mono text-stone-500">{m.username}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${m.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {m.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-600">{m.phone}</td>
                        <td className="py-3 px-4 text-right">
                          {currentUser.username === m.username ? (
                            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">Active</span>
                          ) : (
                            <button
                              onClick={() => {
                                setCurrentUser(m);
                                showToast(`Switched active user to ${m.name}`);
                              }}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded text-xs font-bold"
                            >
                              Log in
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 10: REPORTS & ANALYTICS */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight">
                  Sales & Revenue Reports
                </h1>
                <p className="text-sm text-stone-500">
                  Channel performance analysis across in-store dining, counter tickets, and web takeaway.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                  <span className="text-xs font-bold text-stone-400 uppercase">Gross Revenue</span>
                  <div className="text-3xl font-black text-stone-900">₹{totalSales.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-stone-500">POS: ₹{posSales} • Online: ₹{onlineSales}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                  <span className="text-xs font-bold text-stone-400 uppercase">Average Ticket Value</span>
                  <div className="text-3xl font-black text-stone-900">
                    ₹{totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0}
                  </div>
                  <p className="text-xs text-stone-500">Across {totalOrdersCount} completed tickets</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                  <span className="text-xs font-bold text-stone-400 uppercase">Cancelled Loss</span>
                  <div className="text-3xl font-black text-rose-600">₹{totalCancelledLoss}</div>
                  <p className="text-xs text-rose-500 font-semibold">{cancelledBills.length} recorded cancellations</p>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 11: STORE & CONTACT INFO (With Official Google Maps URL) */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="text-2xl font-display font-extrabold text-stone-900 tracking-tight">
                  Store Contact, Timings & Google Maps
                </h1>
                <p className="text-sm text-stone-500">
                  Official shop coordinates in Saibaba Colony, phone numbers, and customer directions.
                </p>
              </div>

              <form onSubmit={handleSaveStoreSettings} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Store Address
                    </label>
                    <textarea
                      rows={2}
                      value={storeSettingsForm.address}
                      onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, address: e.target.value })}
                      className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-brand-600" />
                      <span>Official Google Maps Location URL</span>
                    </label>
                    <input
                      type="url"
                      value={storeSettingsForm.googleMapsUrl || 'https://maps.app.goo.gl/FT9isZCy8gY2UDkN7'}
                      onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, googleMapsUrl: e.target.value })}
                      className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono font-bold text-brand-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Primary Phone
                      </label>
                      <input
                        type="text"
                        value={storeSettingsForm.phone}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Secondary Phone
                      </label>
                      <input
                        type="text"
                        value={storeSettingsForm.alternatePhone}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, alternatePhone: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      value={storeSettingsForm.hours}
                      onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, hours: e.target.value })}
                      className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Contact Details</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT HERO SLIDE */}
      {/* ========================================================= */}
      {isHeroModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-display font-extrabold text-stone-900 text-lg">
                {editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
              </h3>
              <button onClick={() => setIsHeroModalOpen(false)} className="p-1 rounded-full hover:bg-stone-100">
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSaveHeroSlide} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Media Type *</label>
                  <select
                    value={heroForm.type}
                    onChange={(e) => setHeroForm({ ...heroForm, type: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 font-bold"
                  >
                    <option value="image">Image (JPG / PNG / WebP)</option>
                    <option value="video">Promotional Video (MP4 / WebM)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Duration (Seconds) *</label>
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={heroForm.duration}
                    onChange={(e) => setHeroForm({ ...heroForm, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Slide Heading *</label>
                <input
                  type="text"
                  required
                  value={heroForm.heading}
                  onChange={(e) => setHeroForm({ ...heroForm, heading: e.target.value })}
                  placeholder="e.g. Authentic Chaats & Snacks in Coimbatore"
                  className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Subtitle / Badge</label>
                <input
                  type="text"
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  placeholder="e.g. Fresh • Tasty • Hygienic"
                  className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={heroForm.description}
                  onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Media URL (Image or Video) *</label>
                <input
                  type="url"
                  required
                  value={heroForm.mediaUrl}
                  onChange={(e) => setHeroForm({ ...heroForm, mediaUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 font-mono"
                />
              </div>

              {heroForm.type === 'video' && (
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Poster Image URL (Shown while video loads) *
                  </label>
                  <input
                    type="url"
                    value={heroForm.posterUrl}
                    onChange={(e) => setHeroForm({ ...heroForm, posterUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 font-mono"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={heroForm.ctaText}
                    onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
                    placeholder="Explore Menu"
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">CTA Link</label>
                  <input
                    type="text"
                    value={heroForm.ctaLink}
                    onChange={(e) => setHeroForm({ ...heroForm, ctaLink: e.target.value })}
                    placeholder="#menu"
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsHeroModalOpen(false)}
                  className="px-4 py-2 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD / EDIT FOOD ITEM */}
      {/* ========================================================= */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 my-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 shrink-0">
              <h3 className="font-display font-extrabold text-stone-900 text-lg">
                {editingItem ? 'Edit Food Item & Photo' : 'Add Food Item & Photo'}
              </h3>
              <button onClick={() => setIsItemModalOpen(false)} className="p-1 rounded-full hover:bg-stone-100">
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pr-1">
              <form id="item-edit-form" onSubmit={handleSaveItem} className="lg:col-span-7 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={itemFormData.name}
                    onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-sm font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Category *</label>
                    <select
                      value={itemFormData.category}
                      onChange={(e) => {
                        const cat = categories.find((c) => c.id === e.target.value);
                        setItemFormData({
                          ...itemFormData,
                          category: e.target.value,
                          categoryName: cat ? cat.name : itemFormData.categoryName,
                        });
                      }}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 font-bold"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={itemFormData.price}
                      onChange={(e) => setItemFormData({ ...itemFormData, price: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-sm font-bold"
                    />
                  </div>
                </div>

                {/* Upload Image Section */}
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-700 block">Food Photography</span>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleImageFileUpload}
                      className="w-full text-xs text-stone-500 file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-500 file:text-white cursor-pointer"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      value={itemFormData.image}
                      onChange={(e) => setItemFormData({ ...itemFormData, image: e.target.value })}
                      placeholder="Or enter direct image URL..."
                      className="w-full px-3 py-1.5 bg-white rounded-xl border border-stone-200 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Prep Time</label>
                    <input
                      type="text"
                      value={itemFormData.prepTime}
                      onChange={(e) => setItemFormData({ ...itemFormData, prepTime: e.target.value })}
                      placeholder="5-8 mins"
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                      <input
                        type="checkbox"
                        checked={itemFormData.isBestSeller}
                        onChange={(e) => setItemFormData({ ...itemFormData, isBestSeller: e.target.checked })}
                        className="w-4 h-4 rounded text-brand-600"
                      />
                      <span>Special / Bestseller</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={itemFormData.description}
                    onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200"
                  />
                </div>
              </form>

              {/* Preview */}
              <div className="lg:col-span-5 bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-stone-700 block mb-2 text-xs">Live Card Preview</span>
                  <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-soft space-y-2">
                    <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-stone-100 relative">
                      <img src={itemFormData.image} alt={itemFormData.name} className="w-full h-full object-cover" />
                      {itemFormData.isBestSeller && (
                        <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded">
                          SPECIAL
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between font-bold text-sm">
                      <span>{itemFormData.name || 'Dish Name'}</span>
                      <span className="text-brand-600">₹{itemFormData.price || 0}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-2">{itemFormData.description}</p>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 mt-4">
                  Visual updates sync across Customer Website and POS immediately.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="px-4 py-2 text-stone-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                form="item-edit-form"
                type="submit"
                className="px-5 py-2 bg-brand-500 text-white font-bold rounded-xl text-xs"
              >
                Save Food Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ADD CATEGORY */}
      {/* ========================================================= */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200">
              <h3 className="font-display font-extrabold text-stone-900 text-base">Add Food Category</h3>
              <button onClick={() => setIsCatModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Desi Shakes, Kulfi"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Category Food Photo URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={catForm.image}
                  onChange={(e) => setCatForm({ ...catForm, image: e.target.value, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-500 text-white font-bold rounded-xl"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
