import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const API = process.env.REACT_APP_API_BASE_URL;

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch(`${API}/me/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Could not fetch profile');
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => setError(err.message));
  }, []);

  // Fetch teacherId after profile is loaded
  useEffect(() => {
    if (!profile) return;
    const token = localStorage.getItem('access');
    fetch(`${API}/teachers/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const teacher = data.find(t => t.user === profile.id);
        setTeacherId(teacher ? teacher.id : null);
      })
      .catch(() => setTeacherId(null));
  }, [profile]);

  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch(`${API}/assignments/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setAssignments(data))
      .catch(() => setAssignments([]));
    fetch(`${API}/subjects/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setSubjects(data))
      .catch(() => setSubjects([]));
    fetch(`${API}/classrooms/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setClasses(data))
      .catch(() => setClasses([]));
  }, []);

  const getSubjectName = id => {
    const subj = subjects.find(s => s.id === id);
    return subj ? subj.name : id;
  };
  const getClassName = id => {
    const cls = classes.find(c => c.id === id);
    return cls ? cls.name : id;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (error) return <div className="student-dashboard-error">{error}</div>;
  if (!profile) return <div className="student-dashboard-loading">Loading...</div>;

  // Filter assignments for this teacher (by teacher id)
  const teacherAssignments = teacherId
    ? assignments.filter(a => a.teacher === teacherId)
    : [];

  // Find classes where this teacher is the class teacher
  const classTeacherOf = teacherId && classes.length > 0
    ? classes.filter(c => c.class_teacher && c.class_teacher.id === teacherId)
    : [];

  return (
    <div className="student-dashboard-container">
      <button className="student-logout-btn" onClick={handleLogout}>Logout</button>
      <h1 className="student-dashboard-title">👨‍🏫 Teacher Dashboard</h1>
      <section className="student-profile-section">
        <h2>Profile</h2>
        <table className="student-profile-table">
          <tbody>
            <tr><th>Username</th><td>{profile.username}</td></tr>
            <tr><th>Email</th><td>{profile.email}</td></tr>
            <tr><th>Role</th><td>{profile.role}</td></tr>
          </tbody>
        </table>
      </section>
      {classTeacherOf.length > 0 && (
        <section className="student-marks-section">
          <h2>Class Teacher For</h2>
          <ul>
            {classTeacherOf.map(c => (
              <li key={c.id}>{c.name}</li>
            ))}
          </ul>
        </section>
      )}
      <section className="student-marks-section">
        <h2>Assigned Subjects & Classes</h2>
        <table className="student-marks-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {teacherAssignments.length === 0 ? (
              <tr><td colSpan="2">No assignments found.</td></tr>
            ) : teacherAssignments.map(a => (
              <tr key={a.id}>
                <td>{getSubjectName(a.subject)}</td>
                <td>{getClassName(a.classroom)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default TeacherDashboard; 