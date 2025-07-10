import React, { useEffect, useState } from 'react';
import { authFetch } from '../../utils';
import { useAuth } from '../../AuthContext';

const API = process.env.REACT_APP_API_BASE_URL;

const AdminClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', class_teacher_id: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetch classes
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API}/classrooms/`);
      const data = await res.json();
      setClasses(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch classes');
      setLoading(false);
    }
  };

  // Fetch teachers
  const fetchTeachers = async () => {
    try {
      const res = await authFetch(`${API}/teachers/`);
      const data = await res.json();
      setTeachers(data);
    } catch {}
  };

  useEffect(() => {
    if (!user) return;
    fetchClasses();
    fetchTeachers();
  }, [user]);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Edit class
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API}/classrooms/${editingId}/` : `${API}/classrooms/`;
      const payload = { name: form.name };
      if (form.class_teacher_id) payload.class_teacher_id = form.class_teacher_id;
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save class');
      setForm({ name: '', class_teacher_id: '' });
      setEditingId(null);
      fetchClasses();
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit button
  const handleEdit = classroom => {
    setForm({
      name: classroom.name,
      class_teacher_id: classroom.class_teacher ? classroom.class_teacher.id : ''
    });
    setEditingId(classroom.id);
  };

  // Delete class
  const handleDelete = async id => {
    if (!window.confirm('Delete this class?')) return;
    try {
      const res = await authFetch(`${API}/classrooms/${id}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchClasses();
    } catch (err) {
      setError(err.message);
    }
  };

  // Compute available teachers for class teacher assignment
  const assignedTeacherIds = classes
    .map(c => c.class_teacher)
    .filter(id => id !== null && id !== undefined);
  const availableTeachers = editingId
    ? teachers.filter(t => !assignedTeacherIds.includes(t.id) || t.id === classes.find(c => c.id === editingId)?.class_teacher)
    : teachers.filter(t => !assignedTeacherIds.includes(t.id));

  return (
    <div className="admin-students-container">
      <h2 className="admin-students-title">Manage Classes</h2>
      <div className="admin-students-card">
        {error && <div className="admin-students-error">{error}</div>}
        <form onSubmit={handleSubmit} className="admin-students-form">
          <div className="admin-students-field">
            <label>Class Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Class Name" required />
          </div>
          <div className="admin-students-field">
            <label>Class Teacher</label>
            <select name="class_teacher_id" value={form.class_teacher_id} onChange={handleChange}>
              <option value="">Assign Class Teacher (optional)</option>
              {Array.isArray(availableTeachers) ? availableTeachers.map(t => (
                <option key={t.id} value={t.id}>{t.full_name}</option>
              )) : null}
            </select>
          </div>
          <div className="admin-students-actions">
            <button type="submit">{editingId ? 'Update' : 'Add'} Class</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', class_teacher_id: '' }); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="admin-students-card">
        {loading ? <div className="admin-students-loading">Loading...</div> : (
          <table className="admin-students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Class Teacher</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(classes) ? classes.map(classroom => (
                <tr key={classroom.id}>
                  <td>{classroom.name}</td>
                  <td>{Array.isArray(teachers) ? teachers.find(t => t.id === classroom.class_teacher)?.full_name || '-' : '-'}</td>
                  <td>
                    <button onClick={() => handleEdit(classroom)}>Edit</button>
                    <button onClick={() => handleDelete(classroom.id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                  </td>
                </tr>
              )) : null}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminClasses; 