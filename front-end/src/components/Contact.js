import React from 'react'
import Header from './Header'

const Contact = () => {
return (
<>
<Header />
<div className="contact">
  <h1>Contact Us</h1>

  <div className="contact-info">
    <div>
      <h3>📍 Address</h3>
      <p>Timbora Street, City, Country</p>
    </div>
    <div>
      <h3>📧 Email</h3>
      <p>wadaniinarais1@gmail.com</p>
    </div>
    <div>
      <h3>📞 Phone</h3>
      <p>+254722206743</p>
    </div>
  </div>

  <div style={{ margin: '24px 0', width: '100%', maxWidth: 600 }}>
    <iframe
      title="Wadaniina Rais School Location"
      src="https://www.google.com/maps?q=Timbora+Street&output=embed"
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
<footer className="footer">
  © 2025 Hybrid School. All rights reserved.
</footer>
</>
)
}

export default Contact
