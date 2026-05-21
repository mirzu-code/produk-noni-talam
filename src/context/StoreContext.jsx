/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from 'react';

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

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const storedProducts = localStorage.getItem('noniTalamProducts');
    if (storedProducts) {
      return JSON.parse(storedProducts);
    } else {
      localStorage.setItem('noniTalamProducts', JSON.stringify(initialProducts));
      return initialProducts;
    }
  });

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('noniTalamProducts', JSON.stringify(updatedProducts));
  };

  const updateProduct = (id, updatedData) => {
    const updatedProducts = products.map((p) => (p.id === id ? { ...p, ...updatedData } : p));
    setProducts(updatedProducts);
    localStorage.setItem('noniTalamProducts', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('noniTalamProducts', JSON.stringify(updatedProducts));
  };

  return (
    <StoreContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </StoreContext.Provider>
  );
};
