import React, { createContext, useContext, useState, useEffect } from 'react';
import { RESTAURANT_INFO } from '../data/restaurantInfo';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('hariom_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [gstRate, setGstRate] = useState(RESTAURANT_INFO.defaultGstRate);
  const [flyingItems, setFlyingItems] = useState([]);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('hariom_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to local storage', e);
    }
  }, [cart]);

  // Trigger smooth flying animation to cart icon
  const triggerFlyAnimation = (startRect, image) => {
    // Target is header cart icon or bottom cart bar
    const cartIcon = document.getElementById('header-cart-btn') || document.getElementById('bottom-cart-bar');
    if (!startRect || !cartIcon) return;

    const targetRect = cartIcon.getBoundingClientRect();
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    const flyId = Date.now() + Math.random();
    const newFly = {
      id: flyId,
      startX,
      startY,
      deltaX: targetX - startX,
      deltaY: targetY - startY,
      image,
    };

    setFlyingItems((prev) => [...prev, newFly]);

    // Animate cart badge bounce upon arrival (~600ms)
    setTimeout(() => {
      setIsCartBouncing(true);
      setTimeout(() => setIsCartBouncing(false), 400);
    }, 550);

    // Remove flying dot after animation
    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((item) => item.id !== flyId));
    }, 700);
  };

  const addToCart = (product, customizations = [], triggerElement = null) => {
    // Generate distinct key if customizations differ
    const custKey = customizations.map((c) => c.id).sort().join('-');
    const cartItemId = custKey ? `${product.id}__${custKey}` : product.id;

    const extraPrice = customizations.reduce((sum, c) => sum + (c.price || 0), 0);
    const unitPrice = product.price + extraPrice;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          basePrice: product.price,
          price: unitPrice,
          image: product.image,
          quantity: 1,
          customizations,
        },
      ];
    });

    // Fly animation
    if (triggerElement) {
      const rect = triggerElement.getBoundingClientRect();
      triggerFlyAnimation(rect, product.image);
    }
  };

  const updateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Computations
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // ₹5 per food item
  const packingCharges = totalItemsCount * RESTAURANT_INFO.packingChargePerItem;
  
  // Configurable GST
  const gstAmount = Math.round(subtotal * gstRate * 100) / 100;
  const grandTotal = Math.round(subtotal + packingCharges + gstAmount);

  // Helper to get quantity of a product across cart (for menu card selector)
  const getProductQuantity = (productId) => {
    return cart
      .filter((item) => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        subtotal,
        packingCharges,
        gstRate,
        setGstRate,
        gstAmount,
        grandTotal,
        getProductQuantity,
        isCartBouncing,
        isCartOpen,
        setIsCartOpen,
        flyingItems,
      }}
    >
      {children}
      {/* Floating Animated flying items */}
      {flyingItems.map((item) => (
        <div
          key={item.id}
          className="flying-dot"
          style={{
            left: `${item.startX}px`,
            top: `${item.startY}px`,
            '--target-x': `${item.deltaX}px`,
            '--target-y': `${item.deltaY}px`,
          }}
        >
          <div className="w-10 h-10 rounded-full border-2 border-brand-500 overflow-hidden shadow-floating bg-white">
            <img src={item.image} alt="Adding" className="w-full h-full object-cover" />
          </div>
        </div>
      ))}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
