import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import AdminStudents from './AdminStudents';
import AdminUserApprovals from './AdminUserApprovals';
import AdminTeachers from './AdminTeachers';
import AdminClasses from './AdminClasses';
import AdminAttendance from './AdminAttendance';
import AdminExams from './AdminExams';
import AdminSubjects from './AdminSubjects';
import AdminBlog from './AdminBlog';
import AdminTeacherSubjectClass from './AdminTeacherSubjectClass';
import AdminMarks from './AdminMarks';
import AdminSchoolInfo from './AdminSchoolInfo';
import './AdminDashboard.css';

const sections = [
  { key: 'students', label: 'Students' },
  { key: 'teachers', label: 'Teachers' },
  { key: 'classes', label: 'Classes' },
  { key: 'marks', label: 'Marks' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'exams', label: 'Exams' },
  { key: 'subjects', label: 'Subjects' },
  { key: 'assignments', label: 'Assignments' },
  { key: 'approvals', label: 'User Approvals' },
  { key: 'blog', label: 'Blog' },
  { key: 'school-info', label: 'School Info' },
];

const AdminDashboard = () => {
  const [section, setSection] = useState('students');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Since this component is wrapped in ProtectedRoute, user should always exist
    if (!user || !user.is_superuser) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
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
        {section === 'teachers' && <AdminTeachers />}
        {section === 'classes' && <AdminClasses />}
        {section === 'marks' && <AdminMarks />}
        {section === 'attendance' && <AdminAttendance />}
        {section === 'exams' && <AdminExams />}
        {section === 'subjects' && <AdminSubjects />}
        {section === 'assignments' && <AdminTeacherSubjectClass />}
        {section === 'approvals' && <AdminUserApprovals />}
        {section === 'blog' && <AdminBlog />}
        {section === 'school-info' && <AdminSchoolInfo />}
        {/* Render other management components here */}
      </main>
    </div>
  );
};

export default AdminDashboard; 