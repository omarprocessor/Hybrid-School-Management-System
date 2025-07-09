import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_BASE_URL;

const AdminTeacherSubjectClass = () => {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ teacher: '', subject: '', classroom: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all assignments
  const fetchAssignments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/assignments/`);
      if (!res.ok) throw new Error('Failed to fetch assignments');
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch teachers, subjects, and classes
  useEffect(() => {
    fetchAssignments();
    fetch(`${API}/teachers/`).then(res => res.json()).then(setTeachers).catch(() => setTeachers([]));
    fetch(`${API}/subjects/`).then(res => res.json()).then(setSubjects).catch(() => setSubjects([]));
    fetch(`${API}/classrooms/`).then(res => res.json()).then(setClasses).catch(() => setClasses([]));
    // eslint-disable-next-line
  }, []);

  // Handle form input
  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle create or update
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API}/assignments/${editingId}/` : `${API}/assignments/`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to save assignment');
      setSuccess(editingId ? 'Assignment updated.' : 'Assignment created.');
      setForm({ teacher: '', subject: '', classroom: '' });
      setEditingId(null);
      fetchAssignments();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit
  const handleEdit = assignment => {
    setForm({
      teacher: assignment.teacher,
      subject: assignment.subject,
      classroom: assignment.classroom
    });
    setEditingId(assignment.id);
    setSuccess('');
    setError('');
  };

  // Handle delete
  const handleDelete = async id => {
    if (!window.confirm('Delete this assignment?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API}/assignments/${id}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete assignment');
      setSuccess('Assignment deleted.');
      fetchAssignments();
    } catch (err) {
      setError(err.message);
    }
  };

  // Helper functions to get names
  const getTeacherName = id => {
    const t = teachers.find(t => t.id === id);
    return t ? t.full_name || t.username || t.id : id;
  };
  const getSubjectName = id => {
    const s = subjects.find(s => s.id === id);
    return s ? s.name : id;
  };
  const getClassName = id => {
    const c = classes.find(c => c.id === id);
    return c ? c.name : id;
  };

  return (
    <div className="admin-students-container">
      <h2 className="admin-students-title">Assign Teachers to Subjects & Classes</h2>
      <div className="admin-students-card">
        <form onSubmit={handleSubmit} className="admin-students-form">
          <div className="admin-students-field">
            <label>Teacher</label>
            <select name="teacher" value={form.teacher} onChange={handleFormChange} required>
              <option value="">Select Teacher</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.full_name || t.username}</option>
              ))}
            </select>
          </div>
          <div className="admin-students-field">
            <label>Subject</label>
            <select name="subject" value={form.subject} onChange={handleFormChange} required>
              <option value="">Select Subject</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="admin-students-field">
            <label>Classroom</label>
            <select name="classroom" value={form.classroom} onChange={handleFormChange} required>
              <option value="">Select Classroom</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="admin-students-actions">
            <button type="submit">{editingId ? 'Update' : 'Assign'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ teacher: '', subject: '', classroom: '' }); }}>Cancel</button>}
          </div>
        </form>
        {error && <div className="admin-students-error">{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 10 }}>{success}</div>}
      </div>
      <div className="admin-students-card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Current Assignments</h3>
        {loading ? <div className="admin-students-loading">Loading...</div> : (
          <table className="admin-students-table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Subject</th>
                <th>Classroom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr><td colSpan="4">No assignments found.</td></tr>
              ) : assignments.map((a, i) => (
                <tr key={a.id || i}>
                  <td>{getTeacherName(a.teacher)}</td>
                  <td>{getSubjectName(a.subject)}</td>
                  <td>{getClassName(a.classroom)}</td>
                  <td>
                    <button onClick={() => handleEdit(a)} style={{ marginRight: 8 }}>Edit</button>
                    <button onClick={() => handleDelete(a.id)} style={{ color: 'red' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminTeacherSubjectClass; 