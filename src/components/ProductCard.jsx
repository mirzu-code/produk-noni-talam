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
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <div className="product-overlay">
          <button className={`btn ${added ? 'btn-accent' : 'btn-primary'}`} onClick={handleAdd}>
            {added ? '✓ Added to Cart' : 'Add to Order'}
          </button>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">RM {parseFloat(product.price).toFixed(2)}</span>
          {/* Mobile visible add button since hover isn't on mobile */}
          <button 
            className="btn btn-outline" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
            onClick={handleAdd}
          >
            {added ? '✓' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
