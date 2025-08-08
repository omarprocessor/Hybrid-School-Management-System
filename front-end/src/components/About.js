import React from 'react'
import Header from './Header'
import Footer from './Footer'

const About = () => {
  return (
    <div className="page-container">
      <Header />
      <div className="page-content">
        <div className="about">
          <h1>About Hybrid School Management System</h1>
          
          {/* Mission Section */}
          <section className="about-section">
            <div>
              <h3>🎯 Our Mission</h3>
              <p>To provide quality education and foster holistic development for every learner through innovative digital solutions.</p>
            </div>
            <div>
              <h3>👁️ Our Vision</h3>
              <p>To be a leading center of academic excellence and innovation in the region, embracing technology for better learning outcomes.</p>
            </div>
            <div>
              <h3>💡 Our Values</h3>
              <p>Excellence, Innovation, Integrity, Collaboration, and Student-Centered Learning.</p>
            </div>
          </section>

          {/* Team Section */}
          <section className="team-section">
            <h2>Our Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <h4>👨‍💼 Management Team</h4>
                <p>Experienced leaders driving innovation and strategic growth in educational technology.</p>
              </div>
              <div className="team-member">
                <h4>👨‍💻 Development Team</h4>
                <p>Skilled developers creating robust, scalable solutions for modern education needs.</p>
              </div>
              <div className="team-member">
                <h4>🎓 Education Specialists</h4>
                <p>Education experts ensuring our platform meets real-world teaching and learning requirements.</p>
              </div>
              <div className="team-member">
                <h4>🛠️ Support Team</h4>
                <p>Dedicated support staff providing excellent customer service and technical assistance.</p>
              </div>
            </div>
          </section>

          {/* Achievements Section */}
          <section className="achievements">
            <h2>Our Achievements</h2>
            <div className="achievements-grid">
              <div className="achievement-item">
                <h4>🏆 Excellence Award</h4>
                <p>Recognized for outstanding contribution to educational technology innovation.</p>
              </div>
              <div className="achievement-item">
                <h4>📈 Growth Milestone</h4>
                <p>Serving over 500+ students and 50+ teachers across multiple institutions.</p>
              </div>
              <div className="achievement-item">
                <h4>🔒 Security Certification</h4>
                <p>ISO 27001 certified for data security and privacy protection.</p>
              </div>
              <div className="achievement-item">
                <h4>🌍 Global Reach</h4>
                <p>Platform accessible worldwide with multi-language support.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default About
