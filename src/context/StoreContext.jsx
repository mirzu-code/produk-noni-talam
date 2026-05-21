/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const StoreContext = createContext();

const initialProducts = [
  {
    id: 1,
    name: 'Seri Muka Pandan',
    price: 3.50,
    image: '/gambar%20kuih/seri%20muka.webp',
    description: 'Bite-sized traditional sweet with a top pandan custard layer and bottom glutinous rice layer.',
    shopUrl: '',
    isOutOfStock: false
  },
  {
    id: 2,
    name: 'Kuih Lapis',
    price: 2.00,
    image: '/gambar%20kuih/kuih%20lapis.webp',
    description: 'Colorful steamed layered cake with a sweet, bouncy texture.',
    shopUrl: '',
    isOutOfStock: false
  },
  {
    id: 3,
    name: 'Onde-Onde',
    price: 4.00,
    image: '/gambar%20kuih/onde-onde.webp',
    description: 'Pandan flavored spheres coated with freshly grated coconut and filled with liquid palm sugar.',
    shopUrl: '',
    isOutOfStock: false
  }
];

const mapDbProduct = (product) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  image: product.image,
  shopUrl: product.shop_url || '',
  isOutOfStock: product.is_out_of_stock || false,
  createdAt: product.created_at || null
});

const toDbProduct = (product) => ({
  name: product.name,
  description: product.description,
  price: product.price,
  image: product.image,
  shop_url: product.shopUrl || '',
  is_out_of_stock: product.isOutOfStock || false
});

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const saveLocalProducts = (items) => {
    localStorage.setItem('noniTalamProducts', JSON.stringify(items));
  };

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load products from Supabase:', error.message);
      const storedProducts = localStorage.getItem('noniTalamProducts');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts(initialProducts);
        saveLocalProducts(initialProducts);
      }
    } else {
      const mapped = (data || []).map(mapDbProduct);
      setProducts(mapped);
      saveLocalProducts(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (product) => {
    const dbProduct = toDbProduct(product);
    const { data, error } = await supabase.from('products').insert([dbProduct]).select().single();

    if (error) {
      console.error('Failed to add product to Supabase:', error.message);
      const newProduct = { ...product, id: Date.now() };
      const updatedProducts = [newProduct, ...products];
      setProducts(updatedProducts);
      saveLocalProducts(updatedProducts);
      return newProduct;
    }

    const mapped = mapDbProduct(data);
    const updatedProducts = [mapped, ...products];
    setProducts(updatedProducts);
    saveLocalProducts(updatedProducts);
    return mapped;
  };

  const updateProduct = async (id, updatedData) => {
    const dbProduct = toDbProduct(updatedData);
    const { data, error } = await supabase
      .from('products')
      .update(dbProduct)
      .eq('id', id)
      .select()
      .single();

    const updatedProducts = products.map((p) => (p.id === id ? { ...p, ...updatedData } : p));
    setProducts(updatedProducts);
    saveLocalProducts(updatedProducts);

    if (error) {
      console.error('Failed to update product in Supabase:', error.message);
      return;
    }

    if (data) {
      const mapped = mapDbProduct(data);
      const refreshed = products.map((p) => (p.id === id ? mapped : p));
      setProducts(refreshed);
      saveLocalProducts(refreshed);
    }
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    saveLocalProducts(updatedProducts);

    if (error) {
      console.error('Failed to delete product from Supabase:', error.message);
    }
  };

  return (
    <StoreContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
      {children}
    </StoreContext.Provider>
  );
};
