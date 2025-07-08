import React from 'react'
import Header from './Header'


const Home = () => {
return (
<>
<Header />
<section className="hero">
  <h1>Welcome to Hybrid School</h1>
  <p>Empowering students for a brighter future in Timbora Street.</p>
  <button>Explore Our School</button>
</section>

<section className="features">
  <div>
    <h3>🎯 Our Mission</h3>
    <p>To provide quality education and foster holistic development for every learner.</p>
  </div>
  <div>
    <h3>👁️ Our Vision</h3>
    <p>To be a leading center of academic excellence and innovation in the region.</p>
  </div>
  <div>
    <h3>💡 Our Motto</h3>
    <p>Inspiring Success, Shaping the Future.</p>
  </div>
</section>

<footer className="footer">
  © 2025 Hybrid School. All rights reserved.
</footer>
</>
)
}

export default Home
