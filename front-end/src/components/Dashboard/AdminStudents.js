import React, { useEffect, useState } from 'react';
import { authFetch } from '../../utils';
import { useAuth } from '../../AuthContext';

const API = process.env.REACT_APP_API_BASE_URL;

const AdminStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ full_name: '', admission_no: '', gender: '', classroom: '', parent_phone: '', profile_pic: null });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    authFetch(`${API}/students/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setStudents(data))
      .catch(() => setStudents([]));
    authFetch(`${API}/classrooms/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setClasses(data))
      .catch(() => setClasses([]));
    setLoading(false);
  }, [user]);

  const getClassName = id => {
    const cls = classes.find(c => c.id === id);
    return cls ? cls.name : id;
  };

  const handleChange = e => {
    if (e.target.name === 'profile_pic') {
      setForm({ ...form, profile_pic: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API}/students/${editingId}/` : `${API}/students/`;
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) formData.append(key, value);
    });
    authFetch(url, {
      method,
      body: formData
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setForm({ full_name: '', admission_no: '', gender: '', classroom: '', parent_phone: '', profile_pic: null });
          setEditingId(null);
          setStudents(editingId ? students.map(s => s.id === editingId ? data : s) : [...students, data]);
        } else {
          setError(data.detail || 'Failed to save student.');
        }
      })
      .catch(() => setError('Failed to save student.'));
  };

  const handleEdit = student => {
    setForm({
      full_name: student.full_name,
      admission_no: student.admission_no,
      gender: student.gender,
      classroom: student.classroom,
      parent_phone: student.parent_phone
    });
    setEditingId(student.id);
  };

  const handleDelete = id => {
    authFetch(`${API}/students/${id}/`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) setStudents(students.filter(s => s.id !== id));
      });
  };

  if (loading) return <div className="admin-students-loading">Loading...</div>;

  return (
    <div className="admin-students-container">
      <h2 className="admin-students-title">Manage Students</h2>
      <div className="admin-students-card">
        <form onSubmit={handleSubmit} className="admin-students-form">
          <div className="admin-students-field">
            <label htmlFor="full_name">Full Name</label>
            <input id="full_name" name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange} required />
          </div>
          <div className="admin-students-field">
            <label htmlFor="admission_no">Admission No</label>
            <input id="admission_no" name="admission_no" placeholder="Admission No" value={form.admission_no} onChange={handleChange} required />
          </div>
          <div className="admin-students-field">
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="admin-students-field">
            <label htmlFor="classroom">Classroom</label>
            <select id="classroom" name="classroom" value={form.classroom} onChange={handleChange} required>
              <option value="">Select Classroom</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="admin-students-field">
            <label htmlFor="parent_phone">Parent Phone</label>
            <input id="parent_phone" name="parent_phone" placeholder="Parent Phone" value={form.parent_phone} onChange={handleChange} required />
          </div>
          <div className="admin-students-field">
            <label htmlFor="profile_pic">Profile Picture</label>
            <input id="profile_pic" name="profile_pic" type="file" accept="image/*" onChange={handleChange} />
          </div>
          <div className="admin-students-actions">
            <button type="submit">{editingId ? 'Update' : 'Add'} Student</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ full_name: '', admission_no: '', gender: '', classroom: '', parent_phone: '', profile_pic: null }); }}>Cancel</button>}
          </div>
        </form>
        {error && <div className="admin-students-error">{error}</div>}
      </div>
      <table className="admin-students-table">
        <thead>
          <tr>
            <th>Profile Pic</th>
            <th>Full Name</th>
            <th>Admission No</th>
            <th>Gender</th>
            <th>Classroom</th>
            <th>Parent Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td><img src={s.profile_pic || '/default-avatar.png'} alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} /></td>
              <td>{s.full_name}</td>
              <td>{s.admission_no}</td>
              <td>{s.gender}</td>
              <td>{getClassName(s.classroom)}</td>
              <td>{s.parent_phone}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStudents; 