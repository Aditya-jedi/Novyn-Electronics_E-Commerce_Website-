import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  // Initialize cart from localStorage when available
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart_items");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Failed to parse cart from localStorage", err);
      return [];
    }
  });

  // Persist cartItems to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem("cart_items", JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to persist cart to localStorage", err);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    if (!product) {
      console.error('addToCart called with undefined product');
      return;
    }
    // support products coming from backend (_id) or local dummy (id)
    const pid = product._id || product.id || null;
    if (!pid) {
      console.error('addToCart: product is missing id/_id', product);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => (item._id || item.id) === pid);
      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === pid
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        );
      }
      // store product with both id forms when available
      const toStore = { ...product, quantity: 1 };
      if (!toStore.id && toStore._id) toStore.id = toStore._id;
      return [...prev, toStore];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
        )
        .filter(Boolean)
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, decreaseQuantity, clearCart, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}