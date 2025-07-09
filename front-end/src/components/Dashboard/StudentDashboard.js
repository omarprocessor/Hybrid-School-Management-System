import React, { useEffect, useState } from 'react'
import './StudentDashboard.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext'

const API = process.env.REACT_APP_API_BASE_URL;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [marks, setMarks] = useState([])
  const [attendance, setAttendance] = useState([])
  const [subjects, setSubjects] = useState([])
  const [exams, setExams] = useState([])
  const [error, setError] = useState('')

useEffect(() => {
    const token = localStorage.getItem('access');
    fetch(`${API}/my-student/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => setProfile(data))
      .catch(() => setError('Failed to fetch profile'));
    fetch(`${API}/my-marks/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setMarks(data))
      .catch(() => setMarks([]))
    fetch(`${API}/my-attendance/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setAttendance(data))
      .catch(() => setAttendance([]))
    fetch(`${API}/subjects/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setSubjects(data))
      .catch(() => setSubjects([]))
    fetch(`${API}/exams/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setExams(data))
      .catch(() => setExams([]))
    fetch(`${API}/classrooms/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setClassrooms(data))
      .catch(() => setClassrooms([]));
  }, []);

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
    navigate('/login');
  }

  if (error) return <div className="student-dashboard-error">{error}</div>
  if (!profile) return <div className="student-dashboard-loading">Loading...</div>

return (
    <div className="student-dashboard-container">
      <button className="student-logout-btn" onClick={handleLogout}>Logout</button>
      <h1 className="student-dashboard-title">👨‍🎓 Student Dashboard</h1>
      <section className="student-profile-section">
        <h2>Profile</h2>
        <table className="student-profile-table">
          <tbody>
            <tr><th>Full Name</th><td>{profile.full_name}</td></tr>
            <tr><th>Admission No</th><td>{profile.admission_no}</td></tr>
            <tr><th>Class</th><td>{getClassName(profile.classroom)}</td></tr>
            <tr><th>Parent Phone</th><td>{profile.parent_phone}</td></tr>
          </tbody>
        </table>
      </section>
      <section className="student-marks-section">
        <h2>Marks</h2>
        <table className="student-marks-table">
          <thead>
            <tr>
              <th>Exam</th>
              {subjects.map(subject => (
                <th key={subject.id}>{subject.name}</th>
              ))}
              <th>Total</th>
              <th>Average</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {exams.length === 0 ? (
              <tr><td colSpan={3 + subjects.length}>No exams found.</td></tr>
            ) : exams.map(exam => {
              // Gather marks for this exam
              const examMarks = marks.filter(mark => mark.exam === exam.id);
              // Map subject id to mark
              const subjectMarkMap = {};
              examMarks.forEach(mark => {
                subjectMarkMap[mark.subject] = mark.exam_score;
              });
              // Calculate total, average, and grade
              const total = examMarks.reduce((sum, mark) => sum + (mark.exam_score || 0), 0);
              const count = subjects.length;
              const average = count > 0 ? (total / count) : 0;
              let grade = 'E';
              if (average >= 80) grade = 'A';
              else if (average >= 70) grade = 'B+';
              else if (average >= 60) grade = 'B';
              else if (average >= 50) grade = 'C';
              else if (average >= 40) grade = 'D';
              // Render row
              return (
                <tr key={exam.id}>
                  <td>{getExamName(exam.id)}</td>
                  {subjects.map(subject => (
                    <td key={subject.id}>{subjectMarkMap[subject.id] !== undefined ? subjectMarkMap[subject.id] : '-'}</td>
                  ))}
                  <td>{total}</td>
                  <td>{average.toFixed(2)}</td>
                  <td>{grade}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <section className="student-attendance-section">
        <h2>Attendance</h2>
        <table className="student-attendance-table">
    <thead>
      <tr>
              <th>Date</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Classroom</th>
      </tr>
    </thead>
    <tbody>
            {attendance.length === 0 ? (
              <tr><td colSpan="4">No attendance records found.</td></tr>
            ) : attendance.map((att, i) => (
              <tr key={i}>
                <td>{att.date}</td>
                <td>{att.time_in}</td>
                <td>{att.time_out}</td>
                <td>{att.classroom}</td>
        </tr>
      ))}
    </tbody>
  </table>
      </section>
    </div>
)
}

export default StudentDashboard
