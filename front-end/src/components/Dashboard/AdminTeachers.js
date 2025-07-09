import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const AdminTeachers = () => {
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
      const res = await fetch(`${API}/teachers/`);
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
      const token = localStorage.getItem('access');
      const res = await fetch(`${API}/users/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => { fetchTeachers(); fetchUsers(); }, []);

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
      const res = await fetch(url, {
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
      const res = await fetch(`${API}/teachers/${id}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchTeachers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Manage Teachers</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="admin-students-form">
        <select name="user" value={form.user} onChange={handleChange} required>
          <option value="">Select User</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
          ))}
        </select>
        <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full Name" required />
        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
        <button type="submit">{editingId ? 'Update' : 'Add'} Teacher</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ user: '', full_name: '', gender: 'M', phone: '' }); }}>Cancel</button>}
      </form>
      {loading ? <p>Loading...</p> : (
        <table className="admin-students-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Full Name</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(teacher => (
              <tr key={teacher.id}>
                <td>{users.find(u => u.id === teacher.user)?.username || teacher.user}</td>
                <td>{teacher.full_name}</td>
                <td>{teacher.gender}</td>
                <td>{teacher.phone}</td>
                <td>
                  <button onClick={() => handleEdit(teacher)}>Edit</button>
                  <button onClick={() => handleDelete(teacher.id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTeachers; 