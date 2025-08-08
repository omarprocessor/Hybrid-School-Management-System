import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [schoolInfo, setSchoolInfo] = useState({
    school_name: 'Hybrid School Management System',
    po_box: 'P.O. Box: 12345 - 00100',
    phone: 'TEL: 020-1234567 / 0720-123456',
    location: 'NAIROBI',
    email: 'info@schoolms.com',
    logo: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      try {
        const API = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(`${API}/school-info/`);
        if (response.ok) {
          const data = await response.json();
          setSchoolInfo(data);
        }
      } catch (error) {
        console.error('Error fetching school info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolInfo();
  }, []);

  if (loading) {
    return (
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Loading...</h4>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>{schoolInfo.school_name}</h4>
          <p>Empowering education through innovative digital solutions.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li>Student Portal</li>
            <li>Teacher Dashboard</li>
            <li>Admin Panel</li>
            <li>Mobile App</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>📍 {schoolInfo.location}</p>
          <p>📧 {schoolInfo.email}</p>
          <p>📞 {schoolInfo.phone}</p>
          <p>📮 {schoolInfo.po_box}</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 {schoolInfo.school_name}. All rights reserved.</p>
        <p>Designed with ❤️ for better education</p>
      </div>
    </footer>
  );
};

export default Footer; 