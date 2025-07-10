import React from 'react';
import { useOutletContext } from 'react-router-dom';

const StudentAttendance = () => {
  const { attendance, classrooms } = useOutletContext();
  return (
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
          ) : Array.isArray(attendance) ? attendance.map((att, i) => (
            <tr key={i}>
              <td>{att.date}</td>
              <td>{att.time_in}</td>
              <td>{att.time_out}</td>
              <td>{att.classroom}</td>
            </tr>
          )) : null}
        </tbody>
      </table>
    </section>
  );
};

export default StudentAttendance; 