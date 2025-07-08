import React from 'react'
import Header from './Header'


const About = () => {
return (
<>
<Header />
<div className="about">
  <h1>About Us</h1>
  <div className="about-section">
    <div>
      <h3>🏫 Who We Are</h3>
      <p>Hybrid School is dedicated to nurturing young minds and building a foundation for lifelong learning. Located in the heart of Timbora Street, we serve a diverse community with a passion for excellence.</p>
    </div>
    <div>
      <h3>📅 Our History</h3>
      <p>Founded with the vision to empower students, our school has grown into a vibrant learning environment where every child is valued and encouraged to reach their full potential.</p>
    </div>
    <div>
      <h3>🤝 Our Values</h3>
      <p>Integrity, respect, inclusivity, and a commitment to academic and personal growth guide everything we do.</p>
    </div>
  </div>
</div>
<footer className="footer">
  © 2025 Hybrid School. All rights reserved.
</footer>
</>
)
}

export default About
