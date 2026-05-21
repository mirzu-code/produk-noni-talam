import React, { useState } from 'react';
import { supabase, buildAdminEmail } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const RegisterAdmin = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const finalEmail = email?.trim() ? email.trim().toLowerCase() : buildAdminEmail(username || '');
    if (!finalEmail) return setError('Please provide a username or email.');
    if (!password) return setError('Please provide a password.');

    // Create auth user
    const { data: signData, error: signError } = await supabase.auth.signUp({ email: finalEmail, password });
    if (signError) {
      setError(signError.message || 'Failed to create auth user');
      return;
    }

    // Insert admin_users row
    const { data, error: insertError } = await supabase
      .from('admin_users')
      .insert([{ username: username || null, email: finalEmail, role: role || 'admin', is_active: true }]);

    if (insertError) {
      setError(insertError.message || 'Failed to create admin record');
      return;
    }

    setSuccess('Admin account created. You can now login.');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div style={{ padding: '3rem' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', background: 'var(--color-bg)', padding: '2rem', borderRadius: '8px' }}>
        <h2>Create Admin Account</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Create a Supabase auth user and register them as an admin.</p>

        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: 6 }}>{error}</div>}
        {success && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: 6 }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <label>Username (optional)</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" placeholder="admin01 or admin 01" />
          </div>

          <div>
            <label>Email (optional)</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="admin01@noni-talam-admin.com" />
          </div>

          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" />
          </div>

          <div>
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="form-control">
              <option value="admin">admin</option>
              <option value="editor">editor</option>
              <option value="designer">designer</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary" type="submit">Create Admin</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/login')}>Back to Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterAdmin;
