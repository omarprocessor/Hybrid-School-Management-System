import React, { useEffect, useState } from 'react'
import './StudentDashboard.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext';
import { authFetch } from '../../utils';
import DashboardLayout from './DashboardLayout';
import { Outlet, Link, useLocation } from 'react-router-dom';
import StudentProfile from './StudentProfile';
import StudentMarks from './StudentMarks';
import StudentAttendance from './StudentAttendance';

const API = process.env.REACT_APP_API_BASE_URL;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [marks, setMarks] = useState([])
  const [attendance, setAttendance] = useState([])
  const [subjects, setSubjects] = useState([])
  const [exams, setExams] = useState([])
  const [error, setError] = useState('')

useEffect(() => {
    if (!user) return;
    authFetch(`${API}/my-student/`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setProfile(data))
      .catch(() => setError('Failed to fetch profile'));
    authFetch(`${API}/my-marks/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setMarks(data))
      .catch(() => setMarks([]));
    authFetch(`${API}/my-attendance/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setAttendance(data))
      .catch(() => setAttendance([]));
    authFetch(`${API}/subjects/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setSubjects(data))
      .catch(() => setSubjects([]));
    authFetch(`${API}/exams/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setExams(data))
      .catch(() => setExams([]));
    authFetch(`${API}/classrooms/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setClassrooms(data))
      .catch(() => setClassrooms([]));
  }, [user]);

  const getSubjectName = id => {
    const subj = subjects.find(s => s.id === id)
    return subj ? subj.name : id
  }
  const getExamName = id => {
    const exam = exams.find(e => e.id === id)
    return exam ? `${exam.name} (Term ${exam.term} ${exam.year})` : id
  }
  const getClassName = id => {
    const cls = classrooms.find(c => c.id === id);
    return cls ? cls.name : id;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  if (error) return <div className="student-dashboard-error">{error}</div>
  if (!profile) return <div className="student-dashboard-loading">Loading...</div>

return (
    <DashboardLayout student={true} onLogout={handleLogout}>
      <div className="student-dashboard-main-content">
        <Outlet context={{ profile, classrooms, marks, attendance, subjects, exams, getClassName }} />
      </div>
    </DashboardLayout>
)
}

export default StudentDashboard
