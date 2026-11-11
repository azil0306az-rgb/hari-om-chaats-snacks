# Hari Om Chaats & Snacks — Food Ordering Platform & POS
## Complete Solution: Customer Website, Billing POS & Admin Dashboard

Production-grade, mobile-first food ordering website developed for **Hari Om Chaats & Snacks**, Saibaba Colony, Coimbatore, Tamil Nadu.

Includes three integrated interfaces:
1. **Customer Food Ordering Web App** (`/`): Mobile-first 10-screen ordering flow with automatic hero image/video slideshow, real-time cart, takeaway pickup scheduler, order tracking, and digital receipts.
2. **Billing POS System** (`/billing`): Counter, Table dine-in, and Online order management, 80mm/58mm thermal receipt printing, table customization, and bill auditing.
3. **Admin Operations Dashboard** (`/admin`): Fixed sidebar management workspace for menu editing, live price updates, image uploads, category thumbnails, hero slideshow media controls, and POS configuration.

---

## 🧭 Application Routes

- `/` — **Customer Web App**: Browsing, Cart, Checkout, Order Tracking, Store Location.
- `/billing` — **Billing POS**: Table management, Counter takeaway, 80mm & 58mm thermal printing.
- `/admin` — **Admin Dashboard**: Live menu management, hero slides, categories, and settings.

---

## 📸 10 Core Application Screens

| Screen # | Name | Description |
|---|---|---|
| **Screen 01** | **Homepage** | Logo, hamburger menu, search, live cart badge, compact hero with live opening status (1 PM – 10 PM), category shortcuts, Today's Specials banner (Pani Puri Combo ₹59), popular food items grid. |
| **Screen 02** | **Menu Categories** | Visual 2-column category grid with photography & item counts across all 12 restaurant menu categories. |
| **Screen 03** | **Category Product Listing** | Subcategory filter pills (All, Pani Puri, Bhel, Sev Puri, Dahi, etc.), vertical food cards with photo, veg tag, description, price, quantity controls & favorite heart. |
| **Screen 04** | **Product Details** | High-res photography, ratings, prep times, customization options (Extra Puri, No Onion, Spicy, etc.), quantity selector, Add to Cart CTA. |
| **Screen 05** | **Shopping Cart** | Itemized list with +/- steppers, remove, Clear All, and transparent bill calculation. |
| **Screen 06** | **Checkout** | Takeaway / Self-Pickup only, customer name, +91 mobile number validation, store pickup address card. |
| **Screen 07** | **Pickup Scheduling & Payment** | ASAP (10-15m) vs Scheduled time slots (1:00 PM – 10:00 PM), simulated payment (Pay at Pickup Counter, UPI, Debit/Credit Card, Net Banking). |
| **Screen 08** | **Order Confirmation** | Confetti celebration burst, unique Order ID (e.g., `#HO3421`), customer details, pickup time, store location, View Receipt action. |
| **Screen 09** | **Order Tracking & Details** | Live 4-step preparation timeline (Confirmed → In Kitchen Preparing → Ready for Counter Pickup → Completed), order breakdown, store calling action. |
| **Screen 10** | **Digital Thermal Receipt** | Authentic store bill receipt styled after a thermal pos receipt with instant Print (`window.print()`) and text receipt download. |

---

## 🧭 Navigation Structure

- **Bottom Navigation Bar (5 Tabs)**:
  - 🏠 **Home**: Homepage, hero, shortcuts, specials, menu grid.
  - 🍽️ **Menu**: 12 Categories grid (Screen 02) → Category Product Listing (Screen 03).
  - 🏷️ **Offers**: Today's Specials, promo codes (`HARIOM10`, `PARTY50`), value combos.
  - 🛍️ **Orders**: Live tracking of ongoing orders (Screen 09), order history, re-ordering.
  - 👤 **Account**: Customer profile, store timings, contact numbers, Instagram, directions.
- **Top Header**:
  - Hamburger button opens the quick-access **Side Navigation Drawer**.
  - Search icon with live instant filtering.
  - Shopping cart icon with real-time item count badge and bounce animation.
- **Fixed Floating Cart Bar**:
  - Automatically floats above the bottom navigation bar (`X Items | ₹GrandTotal | View Cart →`) whenever items are added to cart.
  - Respects `env(safe-area-inset-bottom)` for iPhone safe-areas.

---

## 🍽️ Authoritative Menu Items & Prices (From Restaurant Photos)

1. **BEVERAGES**: Special Tea (₹15), Black Tea (₹15), Lemon Tea (₹20), Ginger Tea (₹20), Filter Coffee (₹25), Black Coffee (₹20), Boost (₹30), Horlicks (₹30), Hot Milk (₹20).
2. **REFRESHERS**: Lemon Soda Sweet/Salt (₹30), Mint Mojito (₹40), Blue Curacao (₹50), Kiwi Iced Tea (₹40), Peach Iced Tea (₹40).
3. **SIGNATURE DRINKS**: Brown Velvet (₹80), Oreo Velvet (₹90), Mocha Velvet (₹90), KitKat Velvet (₹120).
4. **COFFEE & SHAKES**: Cold Coffee (₹120), Cold Milo (₹120), Oreo Milkshake (₹120), Nutella Milkshake (₹130), Biscoff Latte Shake (₹150).
5. **DESI DRINKS**: Masala Chaas (₹30), Classic Sweet Lassi (₹60), Mango Lassi (₹80), Strawberry Lassi (₹80), Dry Fruit Lassi (₹120), Kesariya Thandai (₹120).
6. **SANDWICHES**: Aloo Toast (₹60), Cheese Chilli Toast (₹80), Chutney Cheese Toast (₹70), Veg Cheese Toast (₹80), Club Cheese Sandwich (₹110), Classic Cheese Grill (₹120), Minty Paneer (₹130), Makhani Corn Paneer (₹140), Schezwan Paneer Grill (₹140), Mushroom Island (₹130), Garlic Mushroom (₹150).
7. **SPECIAL PICKS**: Mumbai Sandwich (₹110), Khakhra Sandwich (₹110), Crunchy Lays Sandwich (₹110), Pani Puri Combo (₹59, regular ₹70), Hari Om Grand Chaat Platter (₹150).
8. **PAV BHAJI**: Classic Pav Bhaji (₹90), Cheese Pav Bhaji (₹120).
9. **MAGGI TIME**: Classic Maggi (₹50), Veg Maggi (₹70), Cheese Maggi (₹90), Cheese Garlic Maggi (₹100).
10. **SNACKS**: Samosa (₹20), Bread Butter Jam (₹40), Mumbai Vada Pav (₹45), Masala Samosa (₹50), Cheese Vada Pav (₹60), Cheese Puff (₹60).
11. **CHAAT**: Pani Puri 6 Pcs (₹50), Masala Puri (₹50), Sev Puri (₹60), Bombay Bhel (₹60), Papdi Chaat (₹70), Dahi Papdi Chaat (₹80), Dahi Puri (₹80), Cheese Papdi Chaat (₹100), Lays Chaat (₹80).
12. **PARATHA**: Amritsari Aloo Paratha (₹80), Paneer Paratha (₹100), Cheese Paratha (₹110), Loaded Paratha (₹120).

---

## 🧾 Transparent Bill Calculation Rules
- **Food Subtotal**: Sum of (item base price + customizations) × quantity.
- **Packing Charges**: Exactly **₹5 per food item** (e.g. 3 items = ₹15).
- **GST Rate**: Configurable **5% GST** explicitly itemized on cart, summary, and receipt.
- **Grand Total**: `Subtotal + Packing Charges + GST Amount`.

---

## 📍 Restaurant Details
- **Business Name**: Hari Om Chaats & Snacks
- **Address**: 196, Neel Complex, Raja Annamalai Road, Saibaba Colony, Coimbatore, Tamil Nadu 641011
- **Contacts**: `9940169618` / `9600055167`
- **Hours**: Every day, 1:00 PM – 10:00 PM
- **Instagram**: `@hariomchaatssnacks`

---

## 💻 Tech Stack & Architecture
- **React 19** + **Vite 8**
- **Tailwind CSS v3** with custom brand colors (`brand-500: #F95A08`, warm cream `#FAF7F2`)
- **Lucide Icons**
- **Canvas-Confetti**
- **Architecture**: Modular views, clean context state (`CartContext`), centralized data models (`menuData.js`, `restaurantInfo.js`).
