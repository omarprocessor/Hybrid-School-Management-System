import React from 'react'
import Header from './Header'


const Home = () => {
return (
<>
<Header />
<section className="hero">
  <h1>Welcome to SchoolMS</h1>
  <p>A center of academic excellence in Your Region</p>
  <button>Explore Our School</button>
</section>

<section className="features">
  <div>
    <h3>🎯 Our Mission</h3>
    <p>Lorem ipsum dolor sit amet, an center of academic exices.</p>
  </div>
  <div>
    <h3>👁️ Our Vision</h3>
    <p>Lorem ipsum dolor sit amet, visernecus vitae mata.</p>
  </div>
  <div>
    <h3>💡 Our Motto</h3>
    <p>Lorem ipsum dolor, sit amet, consectetur suptisc.</p>
  </div>
</section>

<footer className="footer">
  © 2024 SchoolMS. All rights reserved.
</footer>
</>
)
}

export default Home
