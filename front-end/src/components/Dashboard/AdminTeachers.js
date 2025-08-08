import React, { useEffect, useState } from 'react';
import { authFetch } from '../../utils';
import { useAuth } from '../../AuthContext';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const AdminTeachers = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ user: '', full_name: '', gender: 'M', phone: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetch teachers
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API}/teachers/`);
      const data = await res.json();
      setTeachers(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch teachers');
      setLoading(false);
    }
  };

  // Fetch users (optionally filter by role=teacher)
  const fetchUsers = async () => {
    try {
      const res = await authFetch(`${API}/users/`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchTeachers();
    fetchUsers();
  }, [user]);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Edit teacher
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API}/teachers/${editingId}/` : `${API}/teachers/`;
      const payload = { ...form };
      if (!payload.user) throw new Error('User is required');
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save teacher');
      setForm({ user: '', full_name: '', gender: 'M', phone: '' });
      setEditingId(null);
      fetchTeachers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit button
  const handleEdit = teacher => {
    setForm({
      user: teacher.user,
      full_name: teacher.full_name,
      gender: teacher.gender,
      phone: teacher.phone || ''
    });
    setEditingId(teacher.id);
  };

  // Delete teacher
  const handleDelete = async id => {
    if (!window.confirm('Delete this teacher?')) return;
    try {
      const res = await authFetch(`${API}/teachers/${id}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchTeachers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-students-container">
      <h2 className="admin-students-title">Manage Teachers</h2>
      <div className="admin-students-card">
        {error && <div className="admin-students-error">{error}</div>}
        <form onSubmit={handleSubmit} className="admin-students-form">
          <div className="admin-students-field">
            <label>User</label>
            <select name="user" value={form.user} onChange={handleChange} required>
              <option value="">Select User</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
              ))}
            </select>
          </div>
          <div className="admin-students-field">
            <label>Full Name</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full Name" required />
          </div>
          <div className="admin-students-field">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="admin-students-field">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
          </div>
          <div className="admin-students-actions">
            <button type="submit">{editingId ? 'Update' : 'Add'} Teacher</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ user: '', full_name: '', gender: 'M', phone: '' }); }}>Cancel</button>}
          </div>
        </form>
      </div>
      
      <div className="responsive-table-wrapper">
        <div className="table-header">
          Teachers List
        </div>
        <div className="table-container">
          {loading ? <div className="table-loading">Loading...</div> : (
            <table className="admin-students-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(teachers) ? teachers.map(teacher => (
                  <tr key={teacher.id}>
                    <td>{teacher.full_name}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.gender}</td>
                    <td>
                      <button onClick={() => handleEdit(teacher)}>Edit</button>
                      <button onClick={() => handleDelete(teacher.id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                    </td>
                  </tr>
                )) : null}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTeachers; 