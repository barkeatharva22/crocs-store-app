import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // { product, size, color, qty }

  const addToCart = (product, size, color) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product.id === product.id && i.size === size && i.color === color
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], qty: copy[existingIndex].qty + 1 };
        return copy;
      }
      return [...prev, { product, size, color, qty: 1 }];
    });
  };

  const updateQty = (index, delta) => {
    setItems((prev) => {
      const copy = [...prev];
      const newQty = copy[index].qty + delta;
      if (newQty <= 0) {
        copy.splice(index, 1);
      } else {
        copy[index] = { ...copy[index], qty: newQty };
      }
      return copy;
    });
  };

  const removeFromCart = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.product.price, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addToCart, updateQty, removeFromCart, clearCart, totalItems, totalPrice }),
    [items, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
