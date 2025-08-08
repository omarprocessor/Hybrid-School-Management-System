import React, { useState, useEffect } from 'react';

const AdminSchoolInfo = () => {
  const [schoolInfo, setSchoolInfo] = useState({
    school_name: '',
    po_box: '',
    phone: '',
    location: '',
    email: '',
    logo: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    fetchSchoolInfo();
  }, []);

  const fetchSchoolInfo = async () => {
    try {
      const API = process.env.REACT_APP_API_BASE_URL;
      const token = localStorage.getItem('access');
      const response = await fetch(`${API}/school-info/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSchoolInfo(data);
      }
    } catch (error) {
      console.error('Error fetching school info:', error);
      setMessage('Error loading school information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSchoolInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const API = process.env.REACT_APP_API_BASE_URL;
      const token = localStorage.getItem('access');
      
      const formData = new FormData();
      formData.append('school_name', schoolInfo.school_name);
      formData.append('po_box', schoolInfo.po_box);
      formData.append('phone', schoolInfo.phone);
      formData.append('location', schoolInfo.location);
      formData.append('email', schoolInfo.email);
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await fetch(`${API}/school-info/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedData = await response.json();
        setSchoolInfo(updatedData);
        setMessage('School information updated successfully!');
        setLogoFile(null);
        // Reset file input
        const fileInput = document.getElementById('logo-input');
        if (fileInput) fileInput.value = '';
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail || 'Failed to update school information'}`);
      }
    } catch (error) {
      console.error('Error updating school info:', error);
      setMessage('Error updating school information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-students-container">
        <div className="admin-students-card">
          <div className="admin-students-loading">Loading school information...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-students-container">
      <div className="admin-students-title">School Information Management</div>
      
      <div className="admin-students-card">
        <form onSubmit={handleSubmit} className="admin-students-form">
          <div className="admin-students-field">
            <label htmlFor="school_name">School Name *</label>
            <input
              type="text"
              id="school_name"
              name="school_name"
              value={schoolInfo.school_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="admin-students-field">
            <label htmlFor="po_box">P.O. Box *</label>
            <input
              type="text"
              id="po_box"
              name="po_box"
              value={schoolInfo.po_box}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="admin-students-field">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={schoolInfo.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="admin-students-field">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={schoolInfo.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="admin-students-field">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={schoolInfo.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="admin-students-field">
            <label htmlFor="logo-input">School Logo</label>
            <input
              type="file"
              id="logo-input"
              accept="image/*"
              onChange={handleLogoChange}
            />
            {schoolInfo.logo && (
              <div style={{ marginTop: '10px' }}>
                <p>Current logo:</p>
                <img 
                  src={schoolInfo.logo} 
                  alt="Current school logo" 
                  style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>

          {message && (
            <div className={`admin-students-error ${message.includes('successfully') ? 'admin-students-success' : ''}`}>
              {message}
            </div>
          )}

          <div className="admin-students-actions">
            <button 
              type="submit" 
              disabled={saving}
              style={{ 
                background: '#3F51B5', 
                color: 'white', 
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? 'Saving...' : 'Update School Information'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSchoolInfo; 