import React, { useState, useEffect } from 'react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [schoolName, setSchoolName] = useState('SchoolMS');

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      try {
        const API = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(`${API}/school-info/`);
        if (response.ok) {
          const data = await response.json();
          setSchoolName(data.school_name);
        }
      } catch (error) {
        console.error('Error fetching school info:', error);
      }
    };

    fetchSchoolInfo();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.header')) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  return (
    <header className="header">
      <div className="logo-container">
        <a href="/" className="logo" aria-label="Go to homepage">
          {schoolName}
        </a>
        {isMenuOpen && (
          <button 
            className="close-menu-btn"
            onClick={closeMenu}
            aria-label="Close navigation menu"
            type="button"
          >
            <span className="close-icon" aria-hidden="true">×</span>
          </button>
        )}
      </div>
      
      <nav className={isMenuOpen ? 'mobile-nav-open' : ''} role="navigation" aria-label="Main navigation">
        <a href="/" onClick={closeMenu} aria-label="Go to homepage">Home</a>
        <a href="/about" onClick={closeMenu} aria-label="Go to about page">About Us</a>
        <a href="/contact" onClick={closeMenu} aria-label="Go to contact page">Contact</a>
        <a href="/blog" onClick={closeMenu} aria-label="Go to blog page">Blog</a>
        <a href="/login" onClick={closeMenu} aria-label="Go to login page">Login</a>
      </nav>
      
      {/* Mobile menu toggle button */}
      <button 
        className={`mobile-menu-toggle ${isMenuOpen ? 'menu-open' : ''}`}
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMenuOpen}
        type="button"
      >
        <div className="hamburger-lines" aria-hidden="true">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </div>
      </button>
      
      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="sidebar-overlay open" 
          onClick={closeMenu}
          aria-hidden="true"
          role="presentation"
        ></div>
      )}
    </header>
  )
}

export default Header
