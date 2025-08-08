import React, { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'

const Contact = () => {
  const [schoolInfo, setSchoolInfo] = useState({
    school_name: 'Hybrid School Management System',
    po_box: 'P.O. Box: 12345 - 00100',
    phone: 'TEL: 020-1234567 / 0720-123456',
    location: 'NAIROBI',
    email: 'info@schoolms.com'
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

  return (
    <div className="page-container">
      <Header />
      <div className="page-content">
        <div className="contact">
          <h1>Contact Us</h1>

          <div className="contact-info">
            <div>
              <h3>📍 Address</h3>
              <p>{schoolInfo.location}</p>
              <p>{schoolInfo.po_box}</p>
            </div>
            <div>
              <h3>📧 Email</h3>
              <p>{schoolInfo.email}</p>
            </div>
            <div>
              <h3>📞 Phone</h3>
              <p>{schoolInfo.phone}</p>
            </div>
          </div>

          <div style={{ margin: '24px 0', width: '100%', maxWidth: 600 }}>
            <iframe
              title={`${schoolInfo.school_name} Location`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(schoolInfo.location)}&output=embed`}
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: 8 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <form className="contact-form">
            <input type="text" placeholder="Name" required />
            <input type="email" placeholder="Email" required />
            <textarea placeholder="Message" rows="5"></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Contact
