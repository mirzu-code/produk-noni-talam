import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-card animate-fade-up">
      <div className="product-image-wrapper" style={{ position: 'relative' }}>
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" style={{ opacity: product.isOutOfStock ? 0.6 : 1 }} />
        {product.isOutOfStock && (
          <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#E63946', color: 'white', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            Sold Out
          </div>
        )}
        <div className="product-overlay">
          {product.isOutOfStock ? (
            <button className="btn btn-danger" disabled style={{ cursor: 'not-allowed', opacity: 0.9 }}>
              Out of Stock
            </button>
          ) : (
            <button className={`btn ${added ? 'btn-accent' : 'btn-primary'}`} onClick={handleAdd}>
              {added ? '✓ Added to Cart' : 'Add to Order'}
            </button>
          )}
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">RM {parseFloat(product.price).toFixed(2)}</span>
          {/* Mobile visible add button since hover isn't on mobile */}
          <button 
            className={`btn ${product.isOutOfStock ? 'btn-danger' : 'btn-outline'}`} 
            style={{ 
              padding: '0.4rem 0.8rem', 
              fontSize: '0.9rem', 
              opacity: product.isOutOfStock ? 0.6 : 1, 
              cursor: product.isOutOfStock ? 'not-allowed' : 'pointer',
              border: product.isOutOfStock ? 'none' : ''
            }}
            onClick={product.isOutOfStock ? null : handleAdd}
            disabled={product.isOutOfStock}
          >
            {product.isOutOfStock ? 'Sold Out' : (added ? '✓' : '+ Add')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
