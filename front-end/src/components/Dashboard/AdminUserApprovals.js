import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_BASE_URL;

const AdminUserApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mapping, setMapping] = useState({});

  const fetchPendingUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch(`${API}/user-approvals/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch pending users');
      const data = await res.json();
      setPendingUsers(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API}/students/`);
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      setStudents(data);
    } catch {}
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API}/teachers/`);
      if (!res.ok) throw new Error('Failed to fetch teachers');
      const data = await res.json();
      setTeachers(data);
    } catch {}
  };

  useEffect(() => { fetchPendingUsers(); fetchStudents(); fetchTeachers(); }, []);

  const handleMappingChange = (userId, value) => {
    setMapping({ ...mapping, [userId]: value });
  };

  const handleApprove = async (id, role) => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('access');
      const body = { is_approved: true, role };
      if (role === 'student' && mapping[id]) body.student_id = mapping[id];
      if (role === 'teacher' && mapping[id]) body.teacher_id = mapping[id];
      const res = await fetch(`${API}/user-approvals/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Failed to approve user');
      setSuccess('User approved!');
      fetchPendingUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Pending User Approvals</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {loading ? <p>Loading...</p> : (
        <table className="admin-students-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Requested Role</th>
              <th>Map to Record</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.length === 0 && (
              <tr><td colSpan={5}>No pending users.</td></tr>
            )}
            {pendingUsers.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.requested_role}</td>
                <td>
                  {user.requested_role === 'student' ? (
                    <select value={mapping[user.id] || ''} onChange={e => handleMappingChange(user.id, e.target.value)}>
                      <option value="">Select Student</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.full_name} ({s.admission_no})</option>
                      ))}
                    </select>
                  ) : user.requested_role === 'teacher' ? (
                    <select value={mapping[user.id] || ''} onChange={e => handleMappingChange(user.id, e.target.value)}>
                      <option value="">Select Teacher</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.full_name}</option>
                      ))}
                    </select>
                  ) : null}
                </td>
                <td>
                  <button onClick={() => handleApprove(user.id, user.requested_role)}>
                    Approve & Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUserApprovals; 