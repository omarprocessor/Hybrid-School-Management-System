import React, { useEffect, useState } from 'react';
import { authFetch } from '../../utils';
import { useAuth } from '../../AuthContext';

const API = process.env.REACT_APP_API_BASE_URL;

const AdminExams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState({ name: '', term: '', year: '', start_date: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all exams
  const fetchExams = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch(`${API}/exams/`);
      if (!res.ok) throw new Error('Failed to fetch exams');
      const data = await res.json();
      setExams(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchExams();
  }, [user]);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Edit exam
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.start_date) {
      setError('Start date is required.');
      return;
    }
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API}/exams/${editingId}/` : `${API}/exams/`;
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to save exam');
      setForm({ name: '', term: '', year: '', start_date: '' });
      setEditingId(null);
      fetchExams();
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit button
  const handleEdit = exam => {
    setForm({ name: exam.name, term: exam.term, year: exam.year, start_date: exam.start_date || '' });
    setEditingId(exam.id);
  };

  // Delete exam
  const handleDelete = async id => {
    if (!window.confirm('Delete this exam?')) return;
    try {
      const res = await authFetch(`${API}/exams/${id}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchExams();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-students-container">
      <h2 className="admin-students-title">Manage Exams</h2>
      <div className="admin-students-card">
        <form onSubmit={handleSubmit} className="admin-students-form">
          <div className="admin-students-field">
            <label htmlFor="name">Exam Name</label>
            <input id="name" name="name" placeholder="Exam Name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="admin-students-field">
            <label htmlFor="term">Term</label>
            <input id="term" name="term" placeholder="Term (e.g. 1, 2, 3)" value={form.term} onChange={handleChange} required />
          </div>
          <div className="admin-students-field">
            <label htmlFor="year">Year</label>
            <input id="year" name="year" placeholder="Year (e.g. 2025)" value={form.year} onChange={handleChange} required />
          </div>
          <div className="admin-students-field">
            <label htmlFor="start_date">Start Date</label>
            <input id="start_date" name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
          </div>
          <div className="admin-students-actions">
            <button type="submit">{editingId ? 'Update' : 'Add'} Exam</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', term: '', year: '', start_date: '' }); }}>Cancel</button>}
          </div>
        </form>
        {error && <div className="admin-students-error">{error}</div>}
      </div>
      {loading ? <div className="admin-students-loading">Loading...</div> : (
        <table className="admin-students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Term</th>
              <th>Year</th>
              <th>Start Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.length === 0 ? (
              <tr><td colSpan="5">No exams found.</td></tr>
            ) : Array.isArray(exams) ? exams.map(exam => (
              <tr key={exam.id}>
                <td>{exam.name}</td>
                <td>{exam.term}</td>
                <td>{exam.year}</td>
                <td>{exam.start_date}</td>
                <td>
                  <button onClick={() => handleEdit(exam)}>Edit</button>
                  <button onClick={() => handleDelete(exam.id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                </td>
              </tr>
            )) : null}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminExams; 