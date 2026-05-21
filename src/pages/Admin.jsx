import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useContext(StoreContext);
  const { adminUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    shopUrl: '',
    isOutOfStock: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to ~2MB to avoid localStorage overflow)
      if (file.size > 2 * 1024 * 1024) {
        alert("Saiz gambar terlalu besar. Sila pilih gambar bawah 2MB.");
        e.target.value = null; // reset input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure price is a number
    const productData = {
      ...formData,
      price: parseFloat(formData.price)
    };

    if (isEditing) {
      await updateProduct(currentId, productData);
      setIsEditing(false);
      setCurrentId(null);
    } else {
      await addProduct(productData);
    }

    // Reset form
    setFormData({ name: '', price: '', image: '', description: '', shopUrl: '', isOutOfStock: false });
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      shopUrl: product.shopUrl || '',
      isOutOfStock: product.isOutOfStock || false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: '', price: '', image: '', description: '', shopUrl: '', isOutOfStock: false });
  };

  const displayRole = (role) => {
    if (!role) return 'Admin';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="admin-page container" style={{ padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h2>Admin Dashboard</h2>
            {adminUser && (
              <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                Hi <strong>{displayRole(adminUser.role)}</strong>, welcome back{adminUser.username ? ` — ${adminUser.username}` : ''}!
              </p>
            )}
          </div>
          <div>
            <button onClick={async () => { await logout(); navigate('/login'); }} className="btn btn-outline">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        
        {/* Form Section */}
        <div style={{ 
          background: 'var(--color-bg)', 
          padding: '2rem', 
          borderRadius: 'var(--border-radius)', 
          boxShadow: 'var(--shadow-md)',
          position: 'sticky',
          top: '100px'
        }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
            Edit product details and add the TikTok product URL directly in this form.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input 
                type="text" 
                name="name" 
                className="form-control" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Price (RM)</label>
              <input 
                type="number" 
                name="price"
                step="0.01" 
                className="form-control" 
                value={formData.price} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">TikTok Product Link</label>
              <input
                type="url"
                name="shopUrl"
                className="form-control"
                value={formData.shopUrl}
                onChange={handleInputChange}
                placeholder="https://www.tiktok.com/@yourshop/video/12345"
              />
              <small style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '0.5rem' }}>
                Customers click the product and open this TikTok shop link.
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Sila Pilih Gambar (Bawah 2MB)</label>
              <input 
                type="file" 
                accept="image/*"
                className="form-control" 
                onChange={handleImageUpload} 
                required={!formData.image} 
              />
              {formData.image && (
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={formData.image} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #ddd' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Gambar Berjaya Dimuat Naik</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                name="description" 
                className="form-control" 
                rows="4" 
                value={formData.description} 
                onChange={handleInputChange} 
                required 
              ></textarea>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <input 
                type="checkbox" 
                id="isOutOfStock"
                name="isOutOfStock" 
                checked={formData.isOutOfStock || false} 
                onChange={handleInputChange} 
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="isOutOfStock" className="form-label" style={{ marginBottom: 0, cursor: 'pointer', color: '#E63946', fontWeight: 'bold' }}>
                Mark as Out of Stock
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {isEditing ? 'Update Product' : 'Save Product'}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product List Section */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {products.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-bg)', borderRadius: 'var(--border-radius)' }}>
                No products found. Start adding some!
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} style={{ 
                  display: 'flex', 
                  background: 'var(--color-bg)', 
                  padding: '1.5rem', 
                  borderRadius: 'var(--border-radius)', 
                  boxShadow: 'var(--shadow-sm)',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} 
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {product.name}
                      {product.isOutOfStock && (
                        <span style={{ fontSize: '0.75rem', backgroundColor: '#E63946', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>Out of Stock</span>
                      )}
                    </h4>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      RM {parseFloat(product.price).toFixed(2)}
                    </span>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" style={{ padding: '0.5rem 1rem' }} onClick={() => {
                      if(window.confirm('Are you sure you want to delete this product?')) {
                        deleteProduct(product.id);
                      }
                    }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Admin;
