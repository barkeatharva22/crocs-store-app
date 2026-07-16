import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { INITIAL_PRODUCTS } from '../data/products';
import { supabase } from '../lib/supabase';

const ProductContext = createContext(null);

const TABLE = 'crocs_products';

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    description: row.description,
    image: row.image,
    colors: row.colors || [],
    sizes: row.sizes || [],
    rating: row.rating ? Number(row.rating) : 0,
    reviews: row.reviews || 0,
    tag: row.tag || 'New',
    fromDb: true,
  };
}

export function ProductProvider({ children }) {
  const [customProducts, setCustomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.log('Supabase fetch error:', fetchError.message);
      setError(fetchError.message);
    } else if (data) {
      setCustomProducts(data.map(mapRow));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (product) => {
    const { data, error: insertError } = await supabase
      .from(TABLE)
      .insert({
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        image: product.image,
        colors: product.colors,
        sizes: product.sizes,
        tag: product.tag || 'New',
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    const newProduct = mapRow(data);
    setCustomProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const removeProduct = async (id) => {
    const { error: deleteError } = await supabase.from(TABLE).delete().eq('id', id);
    if (deleteError) throw deleteError;
    setCustomProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Your listed products show first, seed catalog fills out the rest
  const products = useMemo(() => [...customProducts, ...INITIAL_PRODUCTS], [customProducts]);

  const value = useMemo(
    () => ({ products, addProduct, removeProduct, loading, error, refetch: fetchProducts }),
    [products, loading, error, fetchProducts]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used inside ProductProvider');
  return ctx;
}