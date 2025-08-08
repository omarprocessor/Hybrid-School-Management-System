import React from 'react'
import Header from './Header'
import Footer from './Footer'
import StatsSection from './StatsSection'

const Home = () => {
  return (
    <div className="page-container">
      <Header />
      
      <div className="page-content">
        {/* Hero Section */}
        <section className="hero">
          <h1>Welcome to Hybrid School Management System</h1>
          <p>Inspiring Success, Shaping the Future through Digital Excellence.</p>
        </section>

        {/* Services Section */}
        <section className="services">
          <h2>What We Offer</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>📚 Student Management</h3>
              <p>Comprehensive student records, attendance tracking, and performance monitoring.</p>
            </div>
            <div className="service-card">
              <h3>👨‍🏫 Teacher Portal</h3>
              <p>Grade management, lesson planning, and communication tools for educators.</p>
            </div>
            <div className="service-card">
              <h3>📊 Admin Dashboard</h3>
              <p>School-wide analytics, user management, and administrative controls.</p>
            </div>
            <div className="service-card">
              <h3>📱 Mobile Access</h3>
              <p>Access your school information anytime, anywhere with our responsive platform.</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />
      </div>

      <Footer />
    </div>
  )
}

export default Home
