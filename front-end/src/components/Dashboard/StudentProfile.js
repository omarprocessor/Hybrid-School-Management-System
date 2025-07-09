import React from 'react';
import { useOutletContext } from 'react-router-dom';

const StudentProfile = () => {
  const { profile, getClassName } = useOutletContext();
  if (!profile) return null;
  return (
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
  );
};

export default StudentProfile; 