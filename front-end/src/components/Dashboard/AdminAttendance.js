import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_BASE_URL;

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filter, setFilter] = useState({ classroom: '', date: '', student: '' });
  const [form, setForm] = useState({ admission_no: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all attendance records
  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    let url = `${API}/attendance/list/`;
    const params = [];
    if (filter.classroom) params.push(`classroom=${filter.classroom}`);
    if (filter.date) params.push(`date=${filter.date}`);
    if (filter.student) params.push(`student=${filter.student}`);
    if (params.length) url += '?' + params.join('&');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch attendance');
      const data = await res.json();
      setAttendance(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch students and classes for filters and form
  useEffect(() => {
    fetchAttendance();
    fetch(`${API}/students/`).then(res => res.json()).then(setStudents).catch(() => setStudents([]));
    fetch(`${API}/classrooms/`).then(res => res.json()).then(setClasses).catch(() => setClasses([]));
    // eslint-disable-next-line
  }, [filter]);

  // Handle filter changes
  const handleFilterChange = e => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  // Handle form input
  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add attendance (check-in/check-out)
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API}/attendance/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to mark attendance');
      setSuccess('Attendance marked successfully!');
      setForm({ admission_no: '' });
      fetchAttendance();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete attendance (if supported)
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API}/attendance/${id}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete attendance');
      setSuccess('Attendance deleted.');
      fetchAttendance();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-students-container">
      <h2 className="admin-students-title">Manage Attendance</h2>
      <div className="admin-students-card">
        <form onSubmit={handleSubmit} className="admin-students-form">
          <div className="admin-students-field">
            <label htmlFor="admission_no">Admission No</label>
            <input id="admission_no" name="admission_no" placeholder="Admission No" value={form.admission_no} onChange={handleFormChange} required />
          </div>
          <div className="admin-students-actions">
            <button type="submit">Mark Attendance</button>
          </div>
        </form>
        {error && <div className="admin-students-error">{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 10 }}>{success}</div>}
      </div>
      <div className="admin-students-card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Filter Attendance</h3>
        <form className="admin-students-form" onSubmit={e => e.preventDefault()}>
          <div className="admin-students-field">
            <label>Classroom</label>
            <select name="classroom" value={filter.classroom} onChange={handleFilterChange}>
              <option value="">All</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="admin-students-field">
            <label>Date</label>
            <input type="date" name="date" value={filter.date} onChange={handleFilterChange} />
          </div>
          <div className="admin-students-field">
            <label>Student</label>
            <select name="student" value={filter.student} onChange={handleFilterChange}>
              <option value="">All</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.full_name} ({s.admission_no})</option>
              ))}
            </select>
          </div>
        </form>
      </div>
      {loading ? <div className="admin-students-loading">Loading...</div> : (
        <table className="admin-students-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Classroom</th>
              <th>Date</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr><td colSpan="6">No attendance records found.</td></tr>
            ) : attendance.map((att, i) => (
              <tr key={i}>
                <td>{att.student}</td>
                <td>{att.classroom}</td>
                <td>{att.date}</td>
                <td>{att.time_in}</td>
                <td>{att.time_out || '-'}</td>
                <td>
                  <button onClick={() => handleDelete(att.id)} style={{ color: 'red' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAttendance; 