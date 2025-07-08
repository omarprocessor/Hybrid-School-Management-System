import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_BASE_URL;

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: '', code: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all subjects
  const fetchSubjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/subjects/`);
      if (!res.ok) throw new Error('Failed to fetch subjects');
      const data = await res.json();
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchSubjects(); }, []);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Edit subject
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API}/subjects/${editingId}/` : `${API}/subjects/`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to save subject');
      setForm({ name: '', code: '' });
      setEditingId(null);
      fetchSubjects();
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit button
  const handleEdit = subject => {
    setForm({ name: subject.name, code: subject.code });
    setEditingId(subject.id);
  };

  // Delete subject
  const handleDelete = async id => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      const res = await fetch(`${API}/subjects/${id}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchSubjects();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-students-container">
      <h2 className="admin-students-title">Manage Subjects</h2>
      <div className="admin-students-card">
        <form onSubmit={handleSubmit} className="admin-students-form">
          <div className="admin-students-field">
            <label htmlFor="name">Subject Name</label>
            <input id="name" name="name" placeholder="Subject Name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="admin-students-field">
            <label htmlFor="code">Subject Code</label>
            <input id="code" name="code" placeholder="Subject Code" value={form.code} onChange={handleChange} required />
          </div>
          <div className="admin-students-actions">
            <button type="submit">{editingId ? 'Update' : 'Add'} Subject</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', code: '' }); }}>Cancel</button>}
          </div>
        </form>
        {error && <div className="admin-students-error">{error}</div>}
      </div>
      {loading ? <div className="admin-students-loading">Loading...</div> : (
        <table className="admin-students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr><td colSpan="3">No subjects found.</td></tr>
            ) : subjects.map(subject => (
              <tr key={subject.id}>
                <td>{subject.name}</td>
                <td>{subject.code}</td>
                <td>
                  <button onClick={() => handleEdit(subject)}>Edit</button>
                  <button onClick={() => handleDelete(subject.id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminSubjects; 