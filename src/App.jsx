import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import { CartProvider } from './context/CartContext';
import { CustomerApp } from './pages/CustomerApp';
import { BillingPOS } from './pages/BillingPOS';
import { AdminDashboard } from './pages/AdminDashboard';

export function App() {
  return (
    <RestaurantProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. Customer-Facing Mobile-First Food Ordering Website */}
            <Route path="/" element={<CustomerApp />} />

            {/* 2. Restaurant Billing POS Interface */}
            <Route path="/billing" element={<BillingPOS />} />

            {/* 3. Restaurant Admin Management Dashboard */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Fallback to Customer Site */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </RestaurantProvider>
  );
}

export default App;
