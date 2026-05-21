import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct, tiktokUrl, updateTikTokUrl } = useContext(StoreContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure price is a number
    const productData = {
      ...formData,
      price: parseFloat(formData.price)
    };

    if (isEditing) {
      updateProduct(currentId, productData);
      setIsEditing(false);
      setCurrentId(null);
    } else {
      addProduct(productData);
    }

    // Reset form
    setFormData({ name: '', price: '', image: '', description: '', isOutOfStock: false });
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      isOutOfStock: product.isOutOfStock || false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: '', price: '', image: '', description: '', isOutOfStock: false });
  };

  const [tiktokLink, setTiktokLink] = useState(tiktokUrl || '');

  React.useEffect(() => {
    setTiktokLink(tiktokUrl || '');
  }, [tiktokUrl]);

  const handleTikTokChange = (e) => {
    setTiktokLink(e.target.value);
  };

  const saveTikTokLink = () => {
    const url = tiktokLink.trim();
    if (url && !/^https?:\/\//i.test(url)) {
      alert('Please include http:// or https:// in the TikTok Shop link.');
      return;
    }
    updateTikTokUrl(url);
    alert(url ? 'TikTok Shop link saved successfully.' : 'TikTok Shop link cleared.');
  };

  return (
    <div className="admin-page container" style={{ padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Admin Dashboard</h2>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          background: 'var(--color-bg)',
          padding: '2rem',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>TikTok Shop Redirect</h3>
          <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
            Paste the TikTok Shop link here so the homepage redirects directly to your store. This is the first thing admins should set.
          </p>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>
              Paste TikTok Shop Link
            </label>
            <input
              type="url"
              name="tiktokLink"
              className="form-control"
              value={tiktokLink}
              onChange={handleTikTokChange}
              placeholder="https://www.tiktok.com/@yourshop"
              style={{ width: '100%', minHeight: '3rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-primary" onClick={saveTikTokLink}>
              Save TikTok Link
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setTiktokLink(tiktokUrl || '')}>
              Reset Link
            </button>
          </div>

          {tiktokUrl && (
            <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)', wordBreak: 'break-all' }}>
              Current URL: <a href={tiktokUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>{tiktokUrl}</a>
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }}>
        
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
            You can edit product details here and also manage the TikTok Shop redirect link in the same box.
          </p>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">TikTok Shop Redirect Link</label>
            <input
              type="url"
              name="tiktokLink"
              className="form-control"
              value={tiktokLink}
              onChange={handleTikTokChange}
              placeholder="https://www.tiktok.com/@yourshop"
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={saveTikTokLink}>
              Save Link
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setTiktokLink(tiktokUrl || '')}>
              Reset Link
            </button>
          </div>
          
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
