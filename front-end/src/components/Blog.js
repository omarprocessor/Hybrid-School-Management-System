import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const API = process.env.REACT_APP_API_BASE_URL;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/blog/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setPosts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <Header />
      <div className="page-content">
        <div className="blog-main-bg">
          <header className="hero">
            <h1>School Blog</h1>
            <p>News, stories, and updates from Hybrid School</p>
          </header>
          {loading ? <div className="blog-loading">Loading...</div> : (
            <div className="blog-grid">
              {posts.length === 0 ? (
                <div className="blog-empty">No blog posts yet.</div>
              ) : Array.isArray(posts) ? posts.map(post => (
                <div className="blog-card" key={post.slug}>
                  {post.image && <img src={post.image} alt={post.title} className="blog-card-img" />}
                  <div className="blog-card-body">
                    <h2 className="blog-card-title">{post.title}</h2>
                    <p className="blog-card-excerpt">{post.content.slice(0, 120)}{post.content.length > 120 ? '...' : ''}</p>
                    <Link to={`/blog/${post.slug}`} className="blog-card-link">Read More</Link>
                  </div>
                </div>
              )) : null}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog; 