import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const cartCount = getCartCount();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          NONI <span>TALAM</span>
        </Link>
        <div className="navbar-nav">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Store
          </Link>

          <Link to="/studio" className={`nav-link ${location.pathname === '/studio' ? 'active' : ''}`}>
            <span style={{ color: 'var(--color-primary)' }}>Stu</span>
            <span style={{ color: 'var(--color-accent)' }}>dio</span>
          </Link>

          <Link to="/checkout" className={`nav-link cart-link ${location.pathname === '/checkout' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            🛒 Cart
            {cartCount > 0 && (
              <span style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-text-main)',
                borderRadius: '50%',
                padding: '2px 8px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
