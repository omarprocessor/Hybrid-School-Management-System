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
      <p>129 School Rd, City, Country</p>
    </div>
    <div>
      <h3>📧 Email</h3>
      <p>info@schoolms.com</p>
    </div>
    <div>
      <h3>📞 Phone</h3>
      <p>+123 456 7990</p>
    </div>
  </div>

  <form className="contact-form">
    <input type="text" placeholder="Name" required />
    <input type="email" placeholder="Email" required />
    <textarea placeholder="Message" rows="5"></textarea>
    <button type="submit">Send Message</button>
  </form>
</div>
<footer className="footer">
  © 2024 SchoolMS. All rights reserved.
</footer>
</>
)
}

export default Contact
