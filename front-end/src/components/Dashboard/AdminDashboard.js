import React, { useState } from 'react';
import AdminStudents from './AdminStudents';

const sections = [
  { key: 'students', label: 'Students' },
  { key: 'teachers', label: 'Teachers' },
  { key: 'marks', label: 'Marks' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'exams', label: 'Exams' },
  { key: 'subjects', label: 'Subjects' },
];

const AdminDashboard = () => {
  const [section, setSection] = useState('students');

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
  };

  return (
    <div className="admin-dashboard-layout">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <nav>
          {sections.map(s => (
            <button
              key={s.key}
              className={section === s.key ? 'active' : ''}
              onClick={() => setSection(s.key)}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} style={{ marginTop: 'auto', background: '#fff', color: '#3F51B5', width: '100%' }}>Logout</button>
      </aside>
      <main className="admin-main-content">
        <h1>Admin Dashboard</h1>
        {section === 'students' && <AdminStudents />}
        {/* Render other management components here */}
      </main>
    </div>
  );
};

export default AdminDashboard; 