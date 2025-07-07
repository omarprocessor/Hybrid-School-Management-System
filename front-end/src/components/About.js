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
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </div>
    <div>
      <h3>📅 Our History</h3>
      <p>Lorem ipsum dolor sit amet, era consectetur adipiscing elit.</p>
    </div>
    <div>
      <h3>🤝 Our Values</h3>
      <p>Portititus vitae, non vinmu nulla eapittena.</p>
    </div>
  </div>
</div>
<footer className="footer">
  © 2024 SchoolMS. All rights reserved.
</footer>
</>
)
}

export default About
