import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';

const ProductContext = createContext(null);

let idCounter = 1000;

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const addProduct = (product) => {
    idCounter += 1;
    const newProduct = {
      id: `custom-${idCounter}`,
      rating: 0,
      reviews: 0,
      tag: 'New',
      ...product,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const value = useMemo(() => ({ products, addProduct, removeProduct }), [products]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used inside ProductProvider');
  return ctx;
}
