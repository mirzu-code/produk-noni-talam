import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext();

const initialProducts = [
  {
    id: 1,
    name: 'Seri Muka Pandan',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1614088926065-983ce27efc9e?auto=format&fit=crop&q=80&w=400',
    description: 'Bite-sized traditional sweet with a top pandan custard layer and bottom glutinous rice layer.'
  },
  {
    id: 2,
    name: 'Kuih Lapis',
    price: 2.00,
    image: 'https://images.unsplash.com/photo-1541592102781-ef0f10c728ba?auto=format&fit=crop&q=80&w=400',
    description: 'Colorful steamed layered cake with a sweet, bouncy texture.'
  },
  {
    id: 3,
    name: 'Onde-Onde',
    price: 4.00,
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=400',
    description: 'Pandan flavored spheres coated with freshly grated coconut and filled with liquid palm sugar.'
  }
];

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('noniTalamProducts');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('noniTalamProducts', JSON.stringify(initialProducts));
    }
  }, []);

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
