import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENU_ITEMS, CATEGORIES } from '../data/menuData';
import { RESTAURANT_INFO } from '../data/restaurantInfo';

const RestaurantContext = createContext();

// Initial Staff Accounts
const INITIAL_STAFF = [
  { id: 'USR-1', name: 'Rajesh Sharma', username: 'admin', role: 'admin', phone: '9940169618', status: 'Active' },
  { id: 'USR-2', name: 'Murugan K', username: 'pos1', role: 'operator', phone: '9600055167', status: 'Active' },
  { id: 'USR-3', name: 'Kavitha S', username: 'pos2', role: 'operator', phone: '9842100000', status: 'Active' },
];

// Initial In-Store POS Bills
const INITIAL_BILLS = [
  {
    billNo: 'HO-POS-2001',
    tableNo: 'Table 1',
    orderType: 'Table Order',
    customerName: 'Walk-in Guest',
    items: [
      { id: 'pani-puri', name: 'Pani Puri (6 Pcs)', price: 50, quantity: 2 },
      { id: 'classic-pav-bhaji', name: 'Classic Pav Bhaji', price: 90, quantity: 1 },
      { id: 'masala-chaas', name: 'Masala Chaas', price: 30, quantity: 2 }
    ],
    totalItemsCount: 5,
    subtotal: 250,
    packingCharges: 0,
    gstRate: 0.05,
    gstAmount: 12.50,
    grandTotal: 262.50,
    paymentMethod: 'UPI',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'Completed',
    operator: 'Murugan K'
  },
  {
    billNo: 'HO-POS-2002',
    tableNo: 'Table 3',
    orderType: 'Table Order',
    customerName: 'Suresh Kumar',
    items: [
      { id: 'veg-cheese-toast', name: 'Veg Cheese Toast', price: 80, quantity: 2 },
      { id: 'cold-coffee', name: 'Cold Coffee', price: 120, quantity: 2 }
    ],
    totalItemsCount: 4,
    subtotal: 400,
    packingCharges: 0,
    gstRate: 0.05,
    gstAmount: 20.00,
    grandTotal: 420.00,
    paymentMethod: 'Cash',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'Completed',
    operator: 'Murugan K'
  },
  {
    billNo: 'HO-POS-2003',
    tableNo: 'Counter',
    orderType: 'Counter Order',
    customerName: 'Anand R',
    items: [
      { id: 'sev-puri', name: 'Sev Puri', price: 60, quantity: 2 },
      { id: 'dahi-puri', name: 'Dahi Puri', price: 80, quantity: 1 }
    ],
    totalItemsCount: 3,
    subtotal: 200,
    packingCharges: 15,
    gstRate: 0.05,
    gstAmount: 10.00,
    grandTotal: 225.00,
    paymentMethod: 'Card',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    status: 'Cancelled',
    cancellationReason: 'Customer changed order to dine-in',
    cancelledAt: new Date(Date.now() - 1700000).toISOString(),
    cancelledBy: 'Murugan K',
    operator: 'Murugan K'
  }
];

// Initial Simulated Online Orders from Web Store
const INITIAL_ONLINE_ORDERS = [
  {
    orderId: 'HO-WEB-5101',
    customerName: 'Priya Sundaram',
    customerPhone: '+91 98432 11098',
    orderType: 'Pickup (Takeaway)',
    pickupTiming: 'Today at 07:30 PM',
    items: [
      { id: 'pani-puri', name: 'Pani Puri (6 Pcs)', price: 50, quantity: 3, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
      { id: 'dahi-puri', name: 'Dahi Puri', price: 80, quantity: 1, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' },
      { id: 'masala-chaas', name: 'Masala Chaas', price: 30, quantity: 2, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' }
    ],
    totalItemsCount: 6,
    subtotal: 290,
    packingCharges: 30,
    gstRate: 0.05,
    gstAmount: 14.50,
    grandTotal: 334.50,
    paymentMethod: 'UPI Paid (GPay)',
    createdAt: new Date(Date.now() - 900000).toISOString(),
    status: 'Confirmed',
    isNew: true
  },
  {
    orderId: 'HO-WEB-5102',
    customerName: 'Karthik Subramanian',
    customerPhone: '+91 99441 55678',
    orderType: 'Pickup (Takeaway)',
    pickupTiming: 'As Soon As Possible (15-20 mins)',
    items: [
      { id: 'cheese-pav-bhaji', name: 'Cheese Pav Bhaji', price: 120, quantity: 2, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80' },
      { id: 'garlic-mushroom-toast', name: 'Garlic Mushroom Toast', price: 150, quantity: 1, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80' }
    ],
    totalItemsCount: 3,
    subtotal: 390,
    packingCharges: 15,
    gstRate: 0.05,
    gstAmount: 19.50,
    grandTotal: 424.50,
    paymentMethod: 'Cash on Pickup',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    status: 'Preparing',
    isNew: false
  }
];

// Initial Hero Slides Supporting Images & Videos
const INITIAL_HERO_SLIDES = [
  {
    id: 'slide-1',
    type: 'image', // 'image' | 'video'
    heading: 'Authentic Chaats & Snacks in Coimbatore',
    subtitle: 'Fresh • Tasty • Hygienic',
    description: 'Crispy puran, tangy mint water & secret spices made fresh daily in Saibaba Colony.',
    mediaUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
    mobileMediaUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    ctaText: 'Explore Menu',
    ctaLink: '#menu',
    duration: 5, // seconds
    enabled: true,
    order: 1,
  },
  {
    id: 'slide-2',
    type: 'video',
    heading: 'Simmering Butter Pav Bhaji & Hot Toasts',
    subtitle: 'Tawa-Simmered • Rich Flavors',
    description: 'Fresh street-style pav bhaji topped with Amul butter and golden grilled toasts.',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-plate-with-crispy-fries-43037-large.mp4',
    mobileMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-plate-with-crispy-fries-43037-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Order Pav Bhaji',
    ctaLink: '#menu',
    duration: 6,
    enabled: true,
    order: 2,
  },
  {
    id: 'slide-3',
    type: 'image',
    heading: 'Special Chaat Combos & Chilled Refreshers',
    subtitle: 'Pani Puri Combo at ₹59 • Masala Chaas',
    description: 'Indulge in our famous afternoon combos and iced refreshers with friends & family.',
    mediaUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
    mobileMediaUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    ctaText: 'View Specials',
    ctaLink: '#offers',
    duration: 5,
    enabled: true,
    order: 3,
  },
  {
    id: 'slide-4',
    type: 'video',
    heading: "Saibaba Colony's Favorite Food Destination",
    subtitle: '196, Neel Complex • 1:00 PM – 10:00 PM',
    description: 'Convenient takeaway pickup counter and rapid order preparation in 10-15 minutes.',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-a-creamy-dressing-over-a-fresh-salad-43038-large.mp4',
    mobileMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-a-creamy-dressing-over-a-fresh-salad-43038-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Get Directions',
    ctaLink: 'https://maps.app.goo.gl/FT9isZCy8gY2UDkN7',
    duration: 6,
    enabled: true,
    order: 4,
  }
];

export const RestaurantProvider = ({ children }) => {
  // 1. Shared Menu Items
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem('hariom_menu_items');
      return saved ? JSON.parse(saved) : MENU_ITEMS;
    } catch {
      return MENU_ITEMS;
    }
  });

  // 2. Shared Categories
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('hariom_categories');
      return saved ? JSON.parse(saved) : CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  });

  // 3. Shared Restaurant & Website Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('hariom_settings');
      return saved ? JSON.parse(saved) : {
        ...RESTAURANT_INFO,
        googleMapsUrl: 'https://maps.app.goo.gl/FT9isZCy8gY2UDkN7',
        tables: ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'],
        paymentMethods: { cash: true, upi: true, card: true },
        billPrefix: 'HO-POS-',
        thermalWidth: '80mm',
        defaultPaymentMethod: 'Cash',
        allowOperatorCancel: false,
        allowOperatorReprint: true,
        showGstOnReceipt: true,
        showOnlineOrdersOnPOS: true,
        heroHeading: 'Authentic Chaats & Snacks in Coimbatore',
        heroSubtitle: 'Fresh • Tasty • Hygienic',
        showSpecials: true,
        showCategories: true,
        showLocation: true,
      };
    } catch {
      return {
        ...RESTAURANT_INFO,
        googleMapsUrl: 'https://maps.app.goo.gl/FT9isZCy8gY2UDkN7',
        tables: ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'],
        paymentMethods: { cash: true, upi: true, card: true },
        billPrefix: 'HO-POS-',
        thermalWidth: '80mm',
        defaultPaymentMethod: 'Cash',
        allowOperatorCancel: false,
        allowOperatorReprint: true,
        showGstOnReceipt: true,
        showOnlineOrdersOnPOS: true,
        heroHeading: 'Authentic Chaats & Snacks in Coimbatore',
        heroSubtitle: 'Fresh • Tasty • Hygienic',
        showSpecials: true,
        showCategories: true,
        showLocation: true,
      };
    }
  });

  // 4. Hero Slides (Image/Video Carousel System)
  const [heroSlides, setHeroSlides] = useState(() => {
    try {
      const saved = localStorage.getItem('hariom_hero_slides');
      return saved ? JSON.parse(saved) : INITIAL_HERO_SLIDES;
    } catch {
      return INITIAL_HERO_SLIDES;
    }
  });

  // 5. POS Bills
  const [bills, setBills] = useState(() => {
    try {
      const saved = localStorage.getItem('hariom_pos_bills');
      return saved ? JSON.parse(saved) : INITIAL_BILLS;
    } catch {
      return INITIAL_BILLS;
    }
  });

  // 6. Online Orders (from customer website)
  const [onlineOrders, setOnlineOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('hariom_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      }
      return INITIAL_ONLINE_ORDERS;
    } catch {
      return INITIAL_ONLINE_ORDERS;
    }
  });

  // 7. Staff
  const [staff, setStaff] = useState(() => {
    try {
      const saved = localStorage.getItem('hariom_staff');
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  // 8. Active Logged-in Staff/Operator (Simulation)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hariom_current_user');
      return saved ? JSON.parse(saved) : { username: 'admin', role: 'admin', name: 'Rajesh Sharma' };
    } catch {
      return { username: 'admin', role: 'admin', name: 'Rajesh Sharma' };
    }
  });

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('hariom_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('hariom_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('hariom_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('hariom_hero_slides', JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem('hariom_pos_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('hariom_orders', JSON.stringify(onlineOrders));
  }, [onlineOrders]);

  useEffect(() => {
    localStorage.setItem('hariom_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('hariom_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Storage listener for cross-tab updates
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'hariom_orders') {
        try {
          setOnlineOrders(JSON.parse(e.newValue || '[]'));
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === 'hariom_hero_slides') {
        try {
          setHeroSlides(JSON.parse(e.newValue || '[]'));
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Menu Management Helpers
  const addMenuItem = (item) => {
    const newItem = {
      ...item,
      id: item.id || `item-${Date.now()}`,
      rating: item.rating || 4.8,
      ratingCount: item.ratingCount || 100,
      isVeg: true,
      enabled: item.enabled !== false,
      posVisible: item.posVisible !== false,
    };
    setMenuItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateMenuItem = (id, updatedFields) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteMenuItem = (id) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleMenuItemStatus = (id) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: item.enabled === false ? true : false } : item
      )
    );
  };

  const togglePOSVisibility = (id) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, posVisible: item.posVisible === false ? true : false } : item
      )
    );
  };

  // Category Management Helpers
  const addCategory = (category) => {
    const newCat = {
      ...category,
      id: category.id || category.name.toLowerCase().replace(/\s+/g, '-'),
      count: 0,
      enabled: true,
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id, updatedFields) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Hero Slide Management Helpers
  const addHeroSlide = (slide) => {
    const newSlide = {
      ...slide,
      id: `slide-${Date.now()}`,
      order: heroSlides.length + 1,
      enabled: true,
    };
    setHeroSlides((prev) => [...prev, newSlide]);
    return newSlide;
  };

  const updateHeroSlide = (id, updatedFields) => {
    setHeroSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  const deleteHeroSlide = (id) => {
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const reorderHeroSlides = (newOrder) => {
    setHeroSlides(newOrder);
  };

  // Online Order Management
  const updateOnlineOrderStatus = (orderId, newStatus) => {
    setOnlineOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus, isNew: false } : o))
    );
  };

  // POS Billing Helpers
  const createPOSBill = (billData) => {
    const prefix = settings.billPrefix || 'HO-POS-';
    const billNo = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
    const newBill = {
      ...billData,
      billNo,
      createdAt: new Date().toISOString(),
      status: 'Completed',
      operator: currentUser?.name || 'Murugan K'
    };
    setBills((prev) => [newBill, ...prev]);
    return newBill;
  };

  const cancelPOSBill = (billNo, reason) => {
    if (!reason || !reason.trim()) {
      throw new Error('Mandatory cancellation reason required');
    }
    setBills((prev) =>
      prev.map((b) =>
        b.billNo === billNo
          ? {
              ...b,
              status: 'Cancelled',
              cancellationReason: reason.trim(),
              cancelledAt: new Date().toISOString(),
              cancelledBy: currentUser?.name || 'Admin'
            }
          : b
      )
    );
  };

  const updatePOSBill = (billNo, updatedFields) => {
    setBills((prev) =>
      prev.map((b) => (b.billNo === billNo ? { ...b, ...updatedFields } : b))
    );
  };

  // Staff Helpers
  const addStaffMember = (member) => {
    const newStaff = {
      ...member,
      id: `USR-${Math.floor(10 + Math.random() * 90)}`,
      status: 'Active'
    };
    setStaff((prev) => [...prev, newStaff]);
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <RestaurantContext.Provider
      value={{
        menuItems,
        setMenuItems,
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
        setHeroSlides,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        reorderHeroSlides,
        bills,
        createPOSBill,
        cancelPOSBill,
        updatePOSBill,
        onlineOrders,
        updateOnlineOrderStatus,
        staff,
        addStaffMember,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

export default RestaurantContext;
