import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Blog.css';
import Header from './Header';

const API = process.env.REACT_APP_API_BASE_URL;

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API}/blog/${slug}/`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setPost(data);
        else setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="blog-loading">Loading...</div>;
  if (notFound || !post) return <div className="blog-empty">Blog post not found.<br /><Link to="/blog" className="blog-card-link">Back to Blog</Link></div>;

  return (
    <div className="blog-main-bg">
      <Header />
      <div className="blog-post-container">
        <Link to="/blog" className="blog-card-link" style={{ marginBottom: 24, display: 'inline-block' }}>← Back to Blog</Link>
        <div className="blog-post-card">
          {post.image && <img src={post.image} alt={post.title} className="blog-post-img" />}
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-post-content">{post.content}</div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost; 