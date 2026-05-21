import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const shopLink = product.shopUrl?.trim();
  const hasLink = Boolean(shopLink);

  const handleView = () => {
    if (!hasLink) return;
    window.open(shopLink, '_blank', 'noreferrer');
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
          <button
            className={`btn ${hasLink ? 'btn-primary' : 'btn-outline'}`}
            onClick={handleView}
            disabled={!hasLink}
            style={{ cursor: hasLink ? 'pointer' : 'not-allowed' }}
          >
            {hasLink ? 'View on TikTok' : 'Link not set'}
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
            className={`btn ${hasLink ? 'btn-outline' : 'btn-secondary'}`}
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.9rem',
              opacity: hasLink ? 1 : 0.6,
              cursor: hasLink ? 'pointer' : 'not-allowed'
            }}
            onClick={handleView}
            disabled={!hasLink}
          >
            {hasLink ? 'View on TikTok' : 'No Link'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
