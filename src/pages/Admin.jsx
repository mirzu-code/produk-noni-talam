import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useContext(StoreContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    setFormData({ name: '', price: '', image: '', description: '' });
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: '', price: '', image: '', description: '' });
  };

  return (
    <div className="admin-page container" style={{ padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Product Management</h2>
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
              <label className="form-label">Image URL</label>
              <input 
                type="url" 
                name="image" 
                className="form-control" 
                value={formData.image} 
                onChange={handleInputChange} 
                required 
                placeholder="https://..."
              />
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
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{product.name}</h4>
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
