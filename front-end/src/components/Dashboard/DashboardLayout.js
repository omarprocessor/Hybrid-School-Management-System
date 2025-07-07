import React from 'react'
import { Link } from 'react-router-dom'
import './DashboardLayout.css'

const DashboardLayout = ({ children }) => {
return (
<div className="layout">
  <aside className="sidebar">
    <div className="sidebar-title">📚 SchoolMS</div>
    <nav>
      <Link to="/dashboard/students">Students</Link>
      <Link to="/dashboard/teachers">Teachers</Link>
      <Link to="/dashboard/classes">Classes</Link>
      <Link to="/dashboard/subjects">Subjects</Link>
      <Link to="/dashboard/exams">Exams</Link>
      <Link to="/dashboard/marks">Marks</Link>
      <Link to="/dashboard/attendance">Attendance</Link>
    </nav>
  </aside>
  <main className="main-content">
    {children}
  </main>
</div>
)
}

export default DashboardLayout
