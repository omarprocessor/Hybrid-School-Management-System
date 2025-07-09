import React from 'react'
import { Link } from 'react-router-dom'
import './DashboardLayout.css'

const DashboardLayout = ({ children, student, onLogout }) => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-title">{student ? '👨‍🎓 SchoolMS' : '📚 SchoolMS'}</div>
        <nav>
          {student ? (
            <>
              <Link to="/dashboard/students/profile">Profile</Link>
              <Link to="/dashboard/students/marks">Marks</Link>
              <Link to="/dashboard/students/attendance">Attendance</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard/classes">Classes</Link>
              <Link to="/dashboard/subjects">Subjects</Link>
              <Link to="/dashboard/exams">Exams</Link>
              <Link to="/dashboard/marks">Marks</Link>
              <Link to="/dashboard/attendance">Attendance</Link>
            </>
          )}
        </nav>
        {student && (
          <button className="student-logout-btn" onClick={onLogout} style={{ marginTop: 'auto' }}>Logout</button>
        )}
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
