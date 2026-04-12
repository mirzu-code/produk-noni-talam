import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const heroImages = [
  'https://images.unsplash.com/photo-1614088926065-983ce27efc9e?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1541592102781-ef0f10c728ba?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=1600'
];

const Home = () => {
  const { products } = useContext(StoreContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Carousel Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4500); // Change image every 4.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {/* Dynamic Hero Section */}
      <section className="hero" style={{
        position: 'relative',
        padding: '8rem 0',
        textAlign: 'center',
        overflow: 'hidden',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center'
      }}>
        
        {/* Background Images with smooth fade transition */}
        {heroImages.map((imgUrl, index) => (
          <div 
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${imgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentImageIndex === index ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              zIndex: 0
            }}
          />
        ))}

        {/* Premium Dark Overlay so text is readable */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(21, 77, 53, 0.75)', // Deep Green tint
          zIndex: 1
        }}></div>

        {/* Hero Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2, color: 'var(--color-bg)' }}>
          <h1 className="animate-fade-up" style={{ color: 'var(--color-accent)', fontSize: '4rem', marginBottom: '1.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Welcome to Noni Talam
          </h1>
          <p className="animate-fade-up" style={{ fontSize: '1.3rem', maxWidth: '650px', margin: '0 auto 2.5rem', opacity: 0.95, animationDelay: '0.2s', textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>
            Experience the finest selection of premium traditional delicacies crafted with passion, authenticity, and generational recipes.
          </p>
          <button className="btn btn-accent animate-fade-up" style={{ animationDelay: '0.4s', padding: '1rem 2rem', fontSize: '1.1rem' }} onClick={() => window.scrollTo({top: 600, behavior: 'smooth'})}>
            Explore Our Menu
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>Our Signature Delicacies</h2>
            <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--color-accent)', margin: '0 auto' }}></div>
          </div>
          
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              <p>No products available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '2.5rem' 
            }}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
