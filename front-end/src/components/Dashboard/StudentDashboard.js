import React, { useEffect, useState } from 'react'
import './StudentDashboard.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext'

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [student, setStudent] = useState(null)
  const [marks, setMarks] = useState([])
  const [attendance, setAttendance] = useState([])
  const [subjects, setSubjects] = useState([])
  const [exams, setExams] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch(`${process.env.REACT_APP_API_BASE_URL}/my-student/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('No student record found for this user.');
        return res.json();
      })
      .then(data => setStudent(data))
      .catch(err => setError(err.message))
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch(`${process.env.REACT_APP_API_BASE_URL}/my-marks/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setMarks(data))
      .catch(() => setMarks([]))
    fetch(`${process.env.REACT_APP_API_BASE_URL}/my-attendance/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setAttendance(data))
      .catch(() => setAttendance([]))
    fetch(`${process.env.REACT_APP_API_BASE_URL}/subjects/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setSubjects(data))
      .catch(() => setSubjects([]))
    fetch(`${process.env.REACT_APP_API_BASE_URL}/exams/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setExams(data))
      .catch(() => setExams([]))
  }, [])

  const getSubjectName = id => {
    const subj = subjects.find(s => s.id === id)
    return subj ? subj.name : id
  }
  const getExamName = id => {
    const exam = exams.find(e => e.id === id)
    return exam ? `${exam.name} (Term ${exam.term} ${exam.year})` : id
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  if (error) return <div className="student-dashboard-error">{error}</div>
  if (!student) return <div className="student-dashboard-loading">Loading...</div>

  return (
    <div className="student-dashboard-container">
      <button className="student-logout-btn" onClick={handleLogout}>Logout</button>
      <h1 className="student-dashboard-title">👨‍🎓 Student Dashboard</h1>
      <section className="student-profile-section">
        <h2>Profile</h2>
        <table className="student-profile-table">
          <tbody>
            <tr><th>Full Name</th><td>{student.full_name}</td></tr>
            <tr><th>Admission No</th><td>{student.admission_no}</td></tr>
            <tr><th>Class</th><td>{student.classroom}</td></tr>
            <tr><th>Parent Phone</th><td>{student.parent_phone}</td></tr>
          </tbody>
        </table>
      </section>
      <section className="student-marks-section">
        <h2>Marks</h2>
        <table className="student-marks-table">
          <thead>
            <tr>
              <th>Exam</th>
              <th>Subject</th>
              <th>CAT 1</th>
              <th>CAT 2</th>
              <th>Exam Score</th>
              <th>Total</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {marks.length === 0 ? (
              <tr><td colSpan="7">No marks found.</td></tr>
            ) : marks.map(mark => (
              <tr key={mark.id}>
                <td>{getExamName(mark.exam)}</td>
                <td>{getSubjectName(mark.subject)}</td>
                <td>{mark.cat1}</td>
                <td>{mark.cat2}</td>
                <td>{mark.exam_score}</td>
                <td>{mark.total}</td>
                <td>{mark.grade}</td>
              </tr>
            ))}
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
