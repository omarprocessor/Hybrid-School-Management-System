import React, { useEffect, useState, useRef } from 'react';
import { authFetch } from '../../utils';
import { useAuth } from '../../AuthContext';

const API = process.env.REACT_APP_API_BASE_URL;

const AdminBlog = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', image: null });
  const [editingSlug, setEditingSlug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef();

  // Fetch all blog posts
  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch(`${API}/blog/`);
      if (!res.ok) throw new Error('Failed to fetch blog posts');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchPosts();
  }, [user]);

  // Handle form input
  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Add or Edit blog post
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    if (form.image) formData.append('image', form.image);
    try {
      let url = `${API}/blog/`;
      let method = 'POST';
      if (editingSlug) {
        url = `${API}/blog/${editingSlug}/`;
        method = 'PUT';
      }
      const res = await authFetch(url, {
        method,
        body: formData
      });
      if (!res.ok) throw new Error('Failed to save blog post');
      setForm({ title: '', content: '', image: null });
      setEditingSlug(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSuccess('Blog post saved!');
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit button
  const handleEdit = post => {
    setForm({ title: post.title, content: post.content, image: null });
    setEditingSlug(post.slug);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Delete blog post
  const handleDelete = async slug => {
    if (!window.confirm('Delete this blog post?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await authFetch(`${API}/blog/${slug}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setSuccess('Blog post deleted.');
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-students-container">
      <h2 className="admin-students-title">Manage Blog Posts</h2>
      <div className="admin-students-card">
        <form onSubmit={handleSubmit} className="admin-students-form" encType="multipart/form-data">
          <div className="admin-students-field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" placeholder="Blog Title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="admin-students-field" style={{ flex: '2 1 100%' }}>
            <label htmlFor="content">Content</label>
            <textarea id="content" name="content" placeholder="Blog Content" value={form.content} onChange={handleChange} rows={5} required style={{ resize: 'vertical', minHeight: 80 }} />
          </div>
          <div className="admin-students-field">
            <label htmlFor="image">Image</label>
            <input id="image" name="image" type="file" accept="image/*" onChange={handleChange} ref={fileInputRef} />
          </div>
          <div className="admin-students-actions">
            <button type="submit">{editingSlug ? 'Update' : 'Add'} Blog Post</button>
            {editingSlug && <button type="button" onClick={() => { setEditingSlug(null); setForm({ title: '', content: '', image: null }); if (fileInputRef.current) fileInputRef.current.value = ''; }}>Cancel</button>}
          </div>
        </form>
        {error && <div className="admin-students-error">{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 10 }}>{success}</div>}
      </div>
      {loading ? <div className="admin-students-loading">Loading...</div> : (
        <table className="admin-students-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Content</th>
              <th>Slug</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan="5">No blog posts found.</td></tr>
            ) : Array.isArray(posts) ? posts.map(post => (
              <tr key={post.slug}>
                <td>{post.image && <img src={post.image} alt={post.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6 }} />}</td>
                <td>{post.title}</td>
                <td style={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.content}</td>
                <td>{post.slug}</td>
                <td>
                  <button onClick={() => handleEdit(post)}>Edit</button>
                  <button onClick={() => handleDelete(post.slug)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                </td>
              </tr>
            )) : null}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBlog; 