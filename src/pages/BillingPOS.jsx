import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { HariOmLogo } from '../components/HariOmLogo';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  X,
  Check,
  AlertCircle,
  RotateCcw,
  History,
  ExternalLink,
  ShieldAlert,
  CreditCard,
  Smartphone,
  Banknote,
  UserCheck,
  Utensils,
  Receipt,
  CheckCircle2,
  Edit3,
  Filter,
  Clock,
  Bell,
  SlidersHorizontal,
  ChevronRight,
  Phone,
  Eye,
  EyeOff,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';

export const BillingPOS = () => {
  const {
    menuItems,
    categories,
    settings,
    updateSettings,
    bills,
    createPOSBill,
    cancelPOSBill,
    onlineOrders,
    updateOnlineOrderStatus,
    togglePOSVisibility,
    currentUser,
    setCurrentUser,
  } = useRestaurant();

  // POS Operational Modes: 'table' | 'counter' | 'online'
  const [posMode, setPosMode] = useState('table');

  // Active Category & Search
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Table & Counter Orders State
  const [selectedTable, setSelectedTable] = useState('Table 1');
  const [guestName, setGuestName] = useState('');
  const [isTakeawayPack, setIsTakeawayPack] = useState(false);
  const [ticketItems, setTicketItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Modals & Panels
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Content Management Modal (Admin only)
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newTableName, setNewTableName] = useState('');

  // Cancellation Modal State
  const [cancelModalBill, setCancelModalBill] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Online incoming orders count & pending notification
  const pendingOnlineOrders = useMemo(() => {
    return onlineOrders.filter((o) => o.status !== 'Completed');
  }, [onlineOrders]);

  const newOrdersCount = onlineOrders.filter((o) => o.isNew || o.status === 'Confirmed').length;

  // Filter food items for the left POS catalog (only showing posVisible !== false items)
  const filteredCatalogItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (item.enabled === false) return false;
      if (item.posVisible === false) return false;
      const matchesCat =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Order Ticket Calculations
  const totalItemsCount = ticketItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = ticketItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const packingCharges = (posMode === 'counter' || isTakeawayPack)
    ? totalItemsCount * (settings.packingChargePerItem || 5)
    : 0;
  const gstRate = settings.defaultGstRate || 0.05;
  const gstAmount = Math.round(subtotal * gstRate * 100) / 100;
  const grandTotal = Math.round(subtotal + packingCharges + gstAmount);

  // Ticket Item Actions
  const handleAddItem = (product) => {
    setTicketItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId, delta) => {
    setTicketItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const handleRemoveItem = (productId) => {
    setTicketItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearOrder = () => {
    if (ticketItems.length === 0) return;
    if (window.confirm('Clear all items in the current active ticket?')) {
      setTicketItems([]);
      setGuestName('');
    }
  };

  // Generate POS Bill
  const handleGenerateBill = (autoPrint = false) => {
    if (ticketItems.length === 0) {
      alert('Please add at least one food item to the ticket.');
      return;
    }

    const billPayload = {
      orderType: posMode === 'table' ? 'Table Order' : 'Counter Order',
      tableNo: posMode === 'table' ? selectedTable : 'Takeaway Counter',
      customerName: guestName.trim() || (posMode === 'table' ? 'Dine-in Guest' : 'Counter Customer'),
      items: ticketItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalItemsCount,
      subtotal,
      packingCharges,
      gstRate,
      gstAmount,
      grandTotal,
      paymentMethod,
    };

    const createdBill = createPOSBill(billPayload);
    setSelectedReceipt(createdBill);

    // Reset ticket
    setTicketItems([]);
    setGuestName('');
    showToast(`Bill #${createdBill.billNo} generated successfully!`);

    if (autoPrint) {
      setTimeout(() => {
        window.print();
      }, 400);
    }
  };

  // Execute Bill Cancellation with Mandatory Reason
  const handleExecuteCancel = (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      setCancelError('Mandatory cancellation reason required');
      return;
    }
    try {
      cancelPOSBill(cancelModalBill.billNo, cancelReason);
      setCancelModalBill(null);
      setCancelReason('');
      setCancelError('');
      showToast(`Bill #${cancelModalBill.billNo} has been marked as Cancelled`);
    } catch (err) {
      setCancelError(err.message);
    }
  };

  // Add Table Name to Store Settings
  const handleAddTable = (e) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    const currentTables = settings.tables || ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'];
    if (currentTables.includes(newTableName.trim())) {
      alert('Table name already exists');
      return;
    }
    updateSettings({ tables: [...currentTables, newTableName.trim()] });
    setNewTableName('');
    showToast(`Added ${newTableName.trim()} to dining tables`);
  };

  const handleRemoveTable = (tableName) => {
    const currentTables = settings.tables || ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'];
    updateSettings({ tables: currentTables.filter((t) => t !== tableName) });
    if (selectedTable === tableName) setSelectedTable(currentTables[0] || 'Table 1');
    showToast(`Removed ${tableName}`);
  };

  const tablesList = settings.tables || ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'];

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col bg-[#F6F4EE] font-sans selection:bg-brand-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. TOP HEADER & NAVIGATION BAR */}
      {/* ========================================================= */}
      <header className="bg-white border-b border-stone-200 px-4 py-2 flex items-center justify-between shrink-0 shadow-2xs z-20">
        <div className="flex items-center gap-3">
          <HariOmLogo size="xs" variant="strong" />
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-stone-900 text-sm tracking-tight">
                BILLING POS
              </span>
              <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.2 rounded font-bold border border-amber-200">
                Saibaba Colony
              </span>
            </div>
            <p className="text-[10px] text-stone-400 leading-tight">
              Rapid Food Billing & Order Dispatch
            </p>
          </div>
        </div>

        {/* CENTER: 3 PRIMARY ORDER MODES (Table, Counter, Online) */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setPosMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              posMode === 'table'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Table Orders</span>
          </button>

          <button
            onClick={() => setPosMode('counter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              posMode === 'counter'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Counter Orders</span>
          </button>

          <button
            onClick={() => setPosMode('online')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all relative ${
              posMode === 'online'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Online Orders</span>
            {newOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-black rounded-full animate-pulse shadow-xs">
                {newOrdersCount}
              </span>
            )}
          </button>
        </div>

        {/* RIGHT CONTROLS: Bill History, Content Settings & Portal Links */}
        <div className="flex items-center gap-2">
          {/* Operator Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs">
            <UserCheck className="w-3.5 h-3.5 text-brand-600" />
            <span className="text-stone-500">Cashier:</span>
            <strong className="text-stone-800">{currentUser.name}</strong>
            <span className="text-[10px] uppercase bg-stone-200 px-1 rounded font-mono font-bold">
              {currentUser.role}
            </span>
          </div>

          {/* POS Content & Tables Settings (Admin only) */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors border border-stone-200"
              title="POS Content & Table Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}

          {/* Past Bills History */}
          <button
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-200 transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bills</span>
            <span>({bills.length})</span>
          </button>

          <a
            href="/admin"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs transition-colors shadow-2xs"
          >
            <span>Admin</span>
          </a>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MAIN POS WORKSPACE: FIXED TWO-PANEL LAYOUT */}
      {/* ========================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* ======================================================= */}
        {/* VIEW A & B: TABLE / COUNTER ORDERING INTERFACE */}
        {/* ======================================================= */}
        {posMode !== 'online' ? (
          <>
            {/* --------------------------------------------------- */}
            {/* LEFT PANEL: FOOD MENU (Fixed Header, Scrollable Cards) */}
            {/* --------------------------------------------------- */}
            <div className="w-7/12 xl:w-2/3 flex flex-col h-full border-r border-stone-200 bg-[#FAF7F2] overflow-hidden">
              {/* STATIC HEADER (Never Scrolls): Search & Category Shortcuts */}
              <div className="p-3 bg-white border-b border-stone-200 shrink-0 space-y-2.5 shadow-2xs z-10">
                {/* Search Bar & Stats */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Fast search items (e.g. Pani Puri, Pav Bhaji, Toast)..."
                      className="w-full pl-9 pr-3 py-1.5 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-stone-500 bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-200 shrink-0">
                    {filteredCatalogItems.length} Products
                  </div>
                </div>

                {/* Fixed Category Shortcuts Row */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-brand-500 text-white shadow-2xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    All Menu
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5 ${
                        selectedCategory === cat.id
                          ? 'bg-brand-500 text-white shadow-2xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SCROLLABLE PRODUCT CATALOG AREA (Only this part scrolls!) */}
              <div className="flex-1 overflow-y-auto p-3.5 scrollbar-thin">
                {filteredCatalogItems.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-stone-400 space-y-2">
                    <Utensils className="w-10 h-10 stroke-1" />
                    <p className="text-xs">No food items found matching your filter</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="text-xs font-bold text-brand-600 hover:underline"
                    >
                      Clear search filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filteredCatalogItems.map((item) => {
                      const inTicket = ticketItems.find((t) => t.id === item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleAddItem(item)}
                          className={`group bg-white rounded-2xl p-2.5 border transition-all duration-150 cursor-pointer flex flex-col justify-between hover:shadow-md hover:border-brand-400 select-none ${
                            inTicket
                              ? 'border-brand-500 bg-brand-50/20 ring-1 ring-brand-500/30'
                              : 'border-stone-200/90'
                          }`}
                        >
                          <div>
                            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-100 mb-2 border border-stone-100">
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
                              {inTicket && (
                                <span className="absolute top-1.5 right-1.5 bg-brand-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-md shadow-xs">
                                  {inTicket.quantity} in Ticket
                                </span>
                              )}
                              <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.2 rounded backdrop-blur-xs">
                                {item.prepTime || '5m'}
                              </span>
                            </div>

                            <h4 className="font-display font-extrabold text-stone-900 text-xs line-clamp-1 leading-snug group-hover:text-brand-600 transition-colors">
                              {item.name}
                            </h4>
                            <span className="text-[10px] text-stone-400 block line-clamp-1">
                              {item.categoryName}
                            </span>
                          </div>

                          <div className="pt-2 flex items-center justify-between border-t border-stone-100 mt-2">
                            <span className="font-black text-xs sm:text-sm text-stone-900">
                              ₹{item.price}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddItem(item);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-2xs transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3 stroke-[3]" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* --------------------------------------------------- */}
            {/* RIGHT PANEL: STATIC ACTIVE ORDER / TABLE SLOT */}
            {/* NEVER REQUIRES SCROLLING FOR GENERATE BILL */}
            {/* --------------------------------------------------- */}
            <div className="w-5/12 xl:w-1/3 flex flex-col h-full bg-white border-l border-stone-200 overflow-hidden shadow-sm">
              {/* ORDER HEADER: Table Selector or Counter Mode */}
              <div className="p-3 bg-stone-50 border-b border-stone-200 shrink-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-stone-900 text-sm">
                      {posMode === 'table' ? 'Table Ticket' : 'Counter Ticket'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {ticketItems.length} items
                    </span>
                  </div>

                  {ticketItems.length > 0 && (
                    <button
                      onClick={handleClearOrder}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                {/* Table selector for Table Mode */}
                {posMode === 'table' ? (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                    {tablesList.map((tbl) => (
                      <button
                        key={tbl}
                        onClick={() => setSelectedTable(tbl)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                          selectedTable === tbl
                            ? 'bg-brand-500 text-white shadow-2xs'
                            : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {tbl}
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Counter Mode: Optional Takeaway packing checkbox */
                  <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-stone-200 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                      <input
                        type="checkbox"
                        checked={isTakeawayPack}
                        onChange={(e) => setIsTakeawayPack(e.target.checked)}
                        className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>Apply Takeaway Packing (₹5/item)</span>
                    </label>
                  </div>
                )}

                {/* Optional Guest Name Input */}
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Optional customer name..."
                  className="w-full px-2.5 py-1 bg-white rounded-lg border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none"
                />
              </div>

              {/* MIDDLE SECTION: SCROLLABLE ITEMS LIST */}
              {/* If many items, only this middle area scrolls within the right panel */}
              <div className="flex-1 overflow-y-auto px-3 py-2 divide-y divide-stone-100 scrollbar-thin">
                {ticketItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 p-4 space-y-2">
                    <Utensils className="w-8 h-8 stroke-1 text-stone-300" />
                    <p className="text-xs font-semibold text-stone-500">
                      Active ticket is empty
                    </p>
                    <p className="text-[11px] text-stone-400 max-w-[200px]">
                      Click any dish on the left catalog to add to {posMode === 'table' ? selectedTable : 'counter'}
                    </p>
                  </div>
                ) : (
                  ticketItems.map((item) => (
                    <div key={item.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-stone-900 truncate">{item.name}</h5>
                        <span className="text-[11px] text-stone-500 font-mono">
                          ₹{item.price} each
                        </span>
                      </div>

                      {/* Stepper: - Qty + */}
                      <div className="flex items-center gap-1.5 bg-stone-100 px-1.5 py-0.5 rounded-lg border border-stone-200 shrink-0">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="w-5 h-5 rounded flex items-center justify-center bg-white text-stone-700 hover:bg-stone-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-black text-xs w-4 text-center text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="w-5 h-5 rounded flex items-center justify-center bg-white text-stone-700 hover:bg-stone-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right shrink-0 w-14">
                        <span className="font-black text-stone-900 block text-xs">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-stone-300 hover:text-rose-500 p-1"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* =================================================== */}
              {/* PERMANENTLY VISIBLE BOTTOM SUMMARY & GENERATE BILL */}
              {/* NEVER REQUIRES SCROLLING - LOCKED AT VIEWPORT BOTTOM */}
              {/* =================================================== */}
              <div className="p-3 bg-stone-50 border-t border-stone-200 shrink-0 space-y-2.5 shadow-lg">
                {/* Bill Breakdown Totals */}
                <div className="space-y-1 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItemsCount} items)</span>
                    <span className="font-mono font-bold text-stone-900">₹{subtotal}</span>
                  </div>

                  {packingCharges > 0 && (
                    <div className="flex justify-between text-amber-700">
                      <span>Packing Charges</span>
                      <span className="font-mono font-bold">₹{packingCharges}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-mono font-bold text-stone-900">₹{gstAmount}</span>
                  </div>

                  <div className="pt-1.5 border-t border-stone-200 flex justify-between items-baseline">
                    <span className="font-display font-black text-sm text-stone-900">
                      FINAL PAYABLE:
                    </span>
                    <span className="font-display font-black text-lg text-brand-600">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>

                {/* Payment Method Pills */}
                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                  {['Cash', 'UPI', 'Card'].map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPaymentMethod(pm)}
                      className={`py-1 rounded-lg text-xs font-bold transition-all text-center border ${
                        paymentMethod === pm
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>

                {/* THE STATIC ACTION BUTTONS (ALWAYS VISIBLE) */}
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    disabled={ticketItems.length === 0}
                    onClick={() => handleGenerateBill(true)}
                    className="flex-1 py-3 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Printer className="w-4 h-4 shrink-0" />
                    <span>Generate & Print Bill</span>
                  </button>

                  <button
                    type="button"
                    disabled={ticketItems.length === 0}
                    onClick={() => handleGenerateBill(false)}
                    className="py-3 px-3 rounded-xl bg-stone-800 hover:bg-stone-900 disabled:opacity-50 text-white font-bold text-xs transition-colors"
                    title="Generate without auto-print"
                  >
                    <Receipt className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ======================================================= */
          /* VIEW C: LIVE ONLINE ORDERS MANAGEMENT QUEUE */
          /* ======================================================= */
          <div className="flex-1 p-6 overflow-y-auto bg-[#FAF7F2]">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-black text-xl text-stone-900">
                      Incoming Online Customer Orders
                    </h2>
                    {newOrdersCount > 0 && (
                      <span className="bg-rose-500 text-white text-xs font-extrabold px-2 py-0.5 rounded-full animate-bounce">
                        {newOrdersCount} New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500">
                    Real-time orders placed via customer mobile website for store takeaway & pickup.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-stone-500">Queue:</span>
                  <span className="font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
                    {pendingOnlineOrders.length} Pending Pickup
                  </span>
                </div>
              </div>

              {/* Online Orders Grid */}
              {onlineOrders.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                  <p className="text-stone-500 text-sm font-semibold">No online orders received yet</p>
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-brand-600 hover:underline"
                  >
                    Open customer website to place a test order →
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {onlineOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className={`bg-white rounded-2xl border p-4 shadow-2xs space-y-3 flex flex-col justify-between transition-all ${
                        order.isNew || order.status === 'Confirmed'
                          ? 'border-amber-400 ring-2 ring-amber-400/20'
                          : 'border-stone-200'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase">
                              Order ID
                            </span>
                            <h3 className="font-mono font-black text-base text-stone-900">
                              #{order.orderId}
                            </h3>
                          </div>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                              order.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : order.status === 'Ready for Pickup'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : order.status === 'Preparing'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-stone-50 p-2.5 rounded-xl space-y-1 text-xs">
                          <p className="font-bold text-stone-900">{order.customerName}</p>
                          <p className="text-stone-600 flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span>{order.customerPhone || order.phoneNumber}</span>
                          </p>
                          <p className="text-brand-600 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Pickup: {order.pickupTiming || order.pickupSlot || 'ASAP (15-20 mins)'}</span>
                          </p>
                        </div>

                        {/* Items */}
                        <div className="space-y-1 text-xs">
                          <p className="text-[10px] font-bold text-stone-400 uppercase">
                            Items ({order.items?.length})
                          </p>
                          <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                            {order.items?.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between py-0.5 border-b border-stone-100 last:border-0"
                              >
                                <span className="font-medium text-stone-800">
                                  {it.quantity} × {it.name}
                                </span>
                                <span className="font-bold text-stone-900">
                                  ₹{it.price * it.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Total & Payment */}
                        <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs">
                          <div>
                            <span className="text-stone-400 block text-[10px]">Payment</span>
                            <strong className="text-stone-900">{order.paymentMethod || 'UPI Paid'}</strong>
                          </div>
                          <div className="text-right">
                            <span className="text-stone-400 block text-[10px]">Grand Total</span>
                            <strong className="font-black text-sm text-stone-900">
                              ₹{order.grandTotal}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Status Stepper Progression */}
                      <div className="pt-2 border-t border-stone-200 space-y-1.5">
                        <span className="text-[10px] font-bold text-stone-400 uppercase">
                          Advance Status:
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            onClick={() => {
                              updateOnlineOrderStatus(order.orderId, 'Preparing');
                              showToast(`Order #${order.orderId} moved to Kitchen Preparing`);
                            }}
                            className={`py-1 text-[11px] font-bold rounded-lg transition-colors text-center ${
                              order.status === 'Preparing'
                                ? 'bg-amber-500 text-white'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }`}
                          >
                            Preparing
                          </button>
                          <button
                            onClick={() => {
                              updateOnlineOrderStatus(order.orderId, 'Ready for Pickup');
                              showToast(`Order #${order.orderId} marked Ready for Pickup`);
                            }}
                            className={`py-1 text-[11px] font-bold rounded-lg transition-colors text-center ${
                              order.status === 'Ready for Pickup'
                                ? 'bg-blue-500 text-white'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }`}
                          >
                            Ready
                          </button>
                          <button
                            onClick={() => {
                              updateOnlineOrderStatus(order.orderId, 'Completed');
                              showToast(`Order #${order.orderId} Completed & Dispatched`);
                            }}
                            className={`py-1 text-[11px] font-bold rounded-lg transition-colors text-center ${
                              order.status === 'Completed'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }`}
                          >
                            Completed
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: BILL HISTORY & CANCELLATION TRAIL */}
      {/* ========================================================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 shrink-0">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-600" />
                <h3 className="font-display font-extrabold text-stone-900 text-lg">
                  Past Bills History ({bills.length})
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Filter */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search past bills by bill number, table, or guest..."
                className="w-full pl-9 pr-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Bills Table */}
            <div className="flex-1 overflow-y-auto border border-stone-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-500 uppercase tracking-wider text-[11px] sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Bill No</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Table/Type</th>
                    <th className="py-2.5 px-3">Guest</th>
                    <th className="py-2.5 px-3">Items</th>
                    <th className="py-2.5 px-3">Total</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {bills
                    .filter((b) => {
                      if (!historySearch.trim()) return true;
                      return (
                        b.billNo.toLowerCase().includes(historySearch.toLowerCase()) ||
                        b.tableNo?.toLowerCase().includes(historySearch.toLowerCase()) ||
                        b.customerName?.toLowerCase().includes(historySearch.toLowerCase())
                      );
                    })
                    .map((b) => (
                      <tr key={b.billNo} className={b.status === 'Cancelled' ? 'bg-rose-50/30' : ''}>
                        <td className="py-2 px-3 font-mono font-bold text-stone-900">{b.billNo}</td>
                        <td className="py-2 px-3 text-stone-500 text-[11px]">
                          {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-2 px-3 font-semibold text-stone-700">{b.tableNo}</td>
                        <td className="py-2 px-3">{b.customerName || 'Walk-in'}</td>
                        <td className="py-2 px-3">{b.items?.length || 0} items</td>
                        <td className="py-2 px-3 font-black text-stone-900">₹{b.grandTotal}</td>
                        <td className="py-2 px-3">
                          {b.status === 'Completed' ? (
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                              Completed
                            </span>
                          ) : (
                            <div className="space-y-0.5">
                              <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                                Cancelled
                              </span>
                              {b.cancellationReason && (
                                <p className="text-[10px] text-rose-600 italic">"{b.cancellationReason}"</p>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right space-x-1">
                          <button
                            onClick={() => setSelectedReceipt(b)}
                            className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded font-bold text-[11px]"
                          >
                            Reprint
                          </button>
                          {b.status === 'Completed' && (
                            <button
                              onClick={() => {
                                setCancelModalBill(b);
                                setCancelReason('');
                                setCancelError('');
                              }}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-bold text-[11px]"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: MANDATORY CANCELLATION REASON MODAL */}
      {/* ========================================================= */}
      {cancelModalBill && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-rose-600 pb-2 border-b border-stone-200">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-display font-extrabold text-stone-900 text-base">
                Cancel Bill #{cancelModalBill.billNo}
              </h3>
            </div>

            <p className="text-xs text-stone-600">
              Restaurant policy requires a <strong>mandatory cancellation reason</strong>. This entry will be permanently logged in the audit ledger.
            </p>

            <form onSubmit={handleExecuteCancel} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Reason for Cancellation *
                </label>
                <textarea
                  rows={3}
                  required
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Customer cancelled order / Wrong items added / Re-entered"
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                {cancelError && <p className="text-xs text-rose-600 mt-1 font-semibold">{cancelError}</p>}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCancelModalBill(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: POS CONTENT & DINING TABLES MANAGEMENT (ADMIN) */}
      {/* ========================================================= */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-brand-600" />
                <h3 className="font-display font-extrabold text-stone-900 text-base">
                  POS Content & Table Settings
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 pr-1">
              {/* Thermal Printer Settings */}
              <div className="space-y-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      Thermal Receipt Printer Format
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Select receipt paper width used by your physical POS thermal printer:
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200">
                    <button
                      type="button"
                      onClick={() => updateSettings({ thermalWidth: '80mm' })}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        settings?.thermalWidth !== '58mm'
                          ? 'bg-brand-500 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      80mm (Standard)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSettings({ thermalWidth: '58mm' })}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        settings?.thermalWidth === '58mm'
                          ? 'bg-brand-500 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      58mm (Compact)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200/80">
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-stone-200">
                    <div>
                      <p className="text-xs font-bold text-stone-800">Operator Cancellation</p>
                      <p className="text-[10px] text-stone-500">Allow billing operator to cancel bills</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSettings({ allowOperatorCancel: !settings?.allowOperatorCancel })}
                      className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                        settings?.allowOperatorCancel ? 'bg-brand-500 justify-end' : 'bg-stone-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-stone-200">
                    <div>
                      <p className="text-xs font-bold text-stone-800">GST Calculation</p>
                      <p className="text-[10px] text-stone-500">Fixed restaurant rate: 5.0%</p>
                    </div>
                    <span className="text-xs font-extrabold text-stone-700 bg-stone-100 px-2 py-1 rounded-md">
                      5%
                    </span>
                  </div>
                </div>
              </div>

              {/* Manage Dining Tables */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Restaurant Tables Setup
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tablesList.map((tbl) => (
                    <div
                      key={tbl}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold border border-stone-200"
                    >
                      <span>{tbl}</span>
                      <button
                        onClick={() => handleRemoveTable(tbl)}
                        className="text-stone-400 hover:text-rose-600"
                        title="Remove Table"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddTable} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    placeholder="New table name (e.g. Table 6, Balcony Table)..."
                    className="flex-1 px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shrink-0"
                  >
                    Add Table
                  </button>
                </form>
              </div>

              {/* POS Catalog Visibility Quick Toggles */}
              <div className="space-y-2 pt-3 border-t border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Product Visibility in POS Menu
                </h4>
                <p className="text-[11px] text-stone-500">
                  Hide or show specific products in the billing catalog without modifying code:
                </p>
                <div className="max-h-48 overflow-y-auto space-y-1.5 border border-stone-200 rounded-xl p-2 bg-stone-50">
                  {menuItems.slice(0, 15).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-1 px-2 rounded-lg bg-white border border-stone-100 text-xs"
                    >
                      <span className="font-bold text-stone-800 truncate max-w-xs">{item.name}</span>
                      <button
                        onClick={() => togglePOSVisibility(item.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.posVisible !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {item.posVisible !== false ? 'Shown' : 'Hidden'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-5 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: 80MM THERMAL RECEIPT PREVIEW / PRINT */}
      {/* ========================================================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-display font-extrabold text-stone-900 text-sm">
                Thermal Receipt Preview
              </h3>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thermal Receipt Box (80mm vs 58mm Dynamic) */}
            <div
              id="thermal-pos-bill"
              className={`bg-[#FCFCFC] border border-stone-300 rounded-2xl mx-auto font-mono text-stone-900 shadow-inner space-y-3 ${
                settings?.thermalWidth === '58mm'
                  ? 'max-w-[270px] text-[10px] p-3.5'
                  : 'max-w-sm text-xs p-5'
              }`}
            >
              <div className="text-center space-y-1">
                <div className="flex justify-center mb-1">
                  <HariOmLogo size="sm" variant="receipt" />
                </div>
                <h2 className="font-black text-sm tracking-tight">HARI OM CHAATS & SNACKS</h2>
                <p className="text-[10px] text-stone-500 leading-tight">
                  196, Neel Complex, Raja Annamalai Rd,<br />
                  Saibaba Colony, Coimbatore - 641011<br />
                  Ph: 9940169618 / 9600055167
                </p>
              </div>

              <div className="border-t border-dashed border-stone-400 pt-2 space-y-0.5 text-[11px]">
                <div className="flex justify-between">
                  <span>Bill No :</span>
                  <strong>{selectedReceipt.billNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Table / Type :</span>
                  <span>{selectedReceipt.tableNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time :</span>
                  <span>{new Date(selectedReceipt.createdAt).toLocaleString('en-GB')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier :</span>
                  <span>{selectedReceipt.operator || currentUser.name}</span>
                </div>
              </div>

              {selectedReceipt.status === 'Cancelled' && (
                <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-700 text-center font-bold text-[10px]">
                  *** CANCELLED BILL ***<br />
                  Reason: {selectedReceipt.cancellationReason}
                </div>
              )}

              {/* Items */}
              <div className="border-t border-b border-dashed border-stone-400 py-2 space-y-1 text-[11px]">
                <div className="flex justify-between font-bold text-[10px] text-stone-500 uppercase">
                  <span>Item</span>
                  <div className="flex gap-4">
                    <span>Qty</span>
                    <span>Amount</span>
                  </div>
                </div>
                {selectedReceipt.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate max-w-[140px]">{it.name}</span>
                    <div className="flex gap-4">
                      <span>{it.quantity}</span>
                      <span>₹{it.price * it.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>₹{selectedReceipt.subtotal}</span>
                </div>
                {selectedReceipt.packingCharges > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>Packing Charges</span>
                    <span>₹{selectedReceipt.packingCharges}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>GST (5%)</span>
                  <span>₹{selectedReceipt.gstAmount}</span>
                </div>
                <div className="flex justify-between font-black text-sm pt-1 border-t border-dashed border-stone-400">
                  <span>TOTAL AMOUNT</span>
                  <span>₹{selectedReceipt.grandTotal}</span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-500 pt-0.5">
                  <span>Paid By :</span>
                  <span className="font-bold">{selectedReceipt.paymentMethod}</span>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-dashed border-stone-400 text-[10px] text-stone-500">
                <p>Thank You! Visit Again! ❤️</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Thermal Receipt</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPOS;
