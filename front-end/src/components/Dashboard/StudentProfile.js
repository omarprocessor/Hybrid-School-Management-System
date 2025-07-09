import React from 'react';
import { useOutletContext } from 'react-router-dom';

let BACKEND_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
if (BACKEND_URL.endsWith('/api')) BACKEND_URL = BACKEND_URL.replace(/\/api$/, '');

const StudentProfile = () => {
  const { profile, getClassName } = useOutletContext();
  if (!profile) return null;
  let imgSrc = '/default-avatar.png';
  if (profile.profile_pic) {
    imgSrc = profile.profile_pic.startsWith('http')
      ? profile.profile_pic
      : `${BACKEND_URL}${profile.profile_pic}`;
  }
  return (
    <section className="student-profile-section">
      <h2>Profile</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
        <img
          src={imgSrc}
          alt="Profile"
          style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '2px solid #3F51B5' }}
        />
        <table className="student-profile-table">
          <tbody>
            <tr><th>Full Name</th><td>{profile.full_name}</td></tr>
            <tr><th>Admission No</th><td>{profile.admission_no}</td></tr>
            <tr><th>Class</th><td>{getClassName(profile.classroom)}</td></tr>
            <tr><th>Parent Phone</th><td>{profile.parent_phone}</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default StudentProfile; 