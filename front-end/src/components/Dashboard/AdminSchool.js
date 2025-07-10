import React, { useEffect, useState, useRef } from 'react';
import { authFetch } from '../../utils';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const formStyle = {
  maxWidth: 420,
  margin: '0 auto',
  background: '#fff',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
};
const labelStyle = { fontWeight: 500, marginBottom: 4 };
const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #ccc',
  borderRadius: 4,
  fontSize: 16,
  marginBottom: 8,
};
const buttonStyle = {
  marginTop: 16,
  padding: '10px 0',
  background: '#3F51B5',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
};
const previewStyle = {
  marginTop: 8,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
};

const AdminSchool = () => {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    setLoading(true);
    authFetch(`${API}/school/`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setSchool(data);
        // If logo is a URL, use it for preview
        setLogoPreview(data.logo ? (data.logo.startsWith('http') ? data.logo : `${API.replace('/api','')}${data.logo}`) : null);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load school details.');
        setLoading(false);
      });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setSchool(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = e => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setSchool(prev => ({ ...prev, logo: file }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('name', school.name || '');
    formData.append('address', school.address || '');
    formData.append('po_box', school.po_box || '');
    if (school.logo instanceof File) {
      formData.append('logo', school.logo);
    }
    try {
      const res = await authFetch(`${API}/school/`, {
        method: 'PUT',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to update school details');
      const data = await res.json();
      setSchool(data);
      setSuccess('School details updated successfully.');
      setLogoPreview(data.logo ? (data.logo.startsWith('http') ? data.logo : `${API.replace('/api','')}${data.logo}`) : null);
    } catch (err) {
      setError('Failed to update school details.');
    }
  };

  if (loading) return <div>Loading school details...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="admin-school-section" style={{ padding: 24 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>School Details</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label style={labelStyle}>Name:</label>
          <input type="text" name="name" value={school?.name || ''} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Address:</label>
          <input type="text" name="address" value={school?.address || ''} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>P.O. Box:</label>
          <input type="text" name="po_box" value={school?.po_box || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Logo:</label>
          <input type="file" accept="image/*" onChange={handleLogoChange} ref={fileInputRef} style={{ marginBottom: 8 }} />
          {logoPreview && (
            <div style={previewStyle}>
              <img src={logoPreview} alt="Logo Preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, border: '1px solid #eee' }} />
            </div>
          )}
        </div>
        <button type="submit" style={buttonStyle}>Save</button>
        {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
};

export default AdminSchool; 