import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_BASE_URL;

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ full_name: '', admission_no: '', gender: 'M', classroom: '', parent_phone: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/students/`);
      const data = await res.json();
      setStudents(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch students');
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Edit student
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API}/students/${editingId}/` : `${API}/students/`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to save student');
      setForm({ full_name: '', admission_no: '', gender: 'M', classroom: '', parent_phone: '' });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit button
  const handleEdit = student => {
    setForm({
      full_name: student.full_name,
      admission_no: student.admission_no,
      gender: student.gender,
      classroom: student.classroom,
      parent_phone: student.parent_phone || ''
    });
    setEditingId(student.id);
  };

  // Delete student
  const handleDelete = async id => {
    if (!window.confirm('Delete this student?')) return;
    try {
      const res = await fetch(`${API}/students/${id}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Manage Students</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="admin-students-form">
        <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full Name" required />
        <input name="admission_no" value={form.admission_no} onChange={handleChange} placeholder="Admission No" required />
        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
        <input name="classroom" value={form.classroom} onChange={handleChange} placeholder="Classroom ID" required />
        <input name="parent_phone" value={form.parent_phone} onChange={handleChange} placeholder="Parent Phone" />
        <button type="submit">{editingId ? 'Update' : 'Add'} Student</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ full_name: '', admission_no: '', gender: 'M', classroom: '', parent_phone: '' }); }}>Cancel</button>}
      </form>
      {loading ? <p>Loading...</p> : (
        <table className="admin-students-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Admission No</th>
              <th>Gender</th>
              <th>Classroom</th>
              <th>Parent Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.full_name}</td>
                <td>{student.admission_no}</td>
                <td>{student.gender}</td>
                <td>{student.classroom}</td>
                <td>{student.parent_phone}</td>
                <td>
                  <button onClick={() => handleEdit(student)}>Edit</button>
                  <button onClick={() => handleDelete(student.id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminStudents; 