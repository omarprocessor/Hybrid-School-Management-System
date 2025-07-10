import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { authFetch } from '../../utils';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [classAttendance, setClassAttendance] = useState([]);
  const [studentsInClass, setStudentsInClass] = useState([]);
  const [attendanceMsg, setAttendanceMsg] = useState('');
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [csvStatus, setCsvStatus] = useState('');
  const [csvErrors, setCsvErrors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    if (!user) return;
    authFetch(`${API}/me/`)
      .then(res => {
        if (!res.ok) throw new Error('Could not fetch profile');
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => setError(err.message));
  }, [user]);

  // Fetch teacherId after profile is loaded
  useEffect(() => {
    if (!user || !profile) return;
    authFetch(`${API}/teachers/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const teacher = data.find(t => t.user === profile.id);
        setTeacherId(teacher ? teacher.id : null);
      })
      .catch(() => setTeacherId(null));
  }, [user, profile]);

  useEffect(() => {
    if (!user) return;
    authFetch(`${API}/assignments/`).then(res => res.ok ? res.json() : []).then(setAssignments).catch(() => setAssignments([]));
    authFetch(`${API}/subjects/`).then(res => res.ok ? res.json() : []).then(setSubjects).catch(() => setSubjects([]));
    authFetch(`${API}/classrooms/`).then(res => res.ok ? res.json() : []).then(setClasses).catch(() => setClasses([]));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    authFetch(`${API}/exams/`).then(res => res.ok ? res.json() : []).then(setExams).catch(() => setExams([]));
  }, [user]);

  // Filter assignments for this teacher (by teacher id)
  const teacherAssignments = teacherId
    ? assignments.filter(a => a.teacher === teacherId)
    : [];

  // Find classes where this teacher is the class teacher
  const classTeacherOf = teacherId && classes.length > 0
    ? classes.filter(c => c.class_teacher && c.class_teacher.id === teacherId)
    : [];

  // Fetch class attendance for class teacher
  useEffect(() => {
    if (!user || !teacherId) return;
    authFetch(`${API}/my-class-attendance/`).then(res => res.ok ? res.json() : []).then(data => setClassAttendance(Array.isArray(data) ? data : [])).catch(() => setClassAttendance([]));
  }, [user, teacherId]);

  // Fetch students in the class if classTeacherOf exists
  useEffect(() => {
    if (!user || classTeacherOf.length === 0) return;
    // Assume only one class for class teacher
    const classId = classTeacherOf[0].id;
    authFetch(`${API}/students/`).then(res => res.ok ? res.json() : []).then(data => {
      setStudentsInClass(data.filter(s => s.classroom === classId));
    }).catch(() => setStudentsInClass([]));
  }, [user, classTeacherOf]);

  // Mark attendance (check-in/check-out)
  const markAttendance = (admission_no) => {
    setAttendanceLoading(true);
    setAttendanceMsg('');
    const token = localStorage.getItem('access');
    fetch(`${API}/attendance/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ admission_no })
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        setAttendanceLoading(false);
        if (ok) {
          setAttendanceMsg('Attendance marked successfully!');
        } else {
          setAttendanceMsg(data.detail || 'Failed to mark attendance.');
        }
      })
      .catch(() => {
        setAttendanceLoading(false);
        setAttendanceMsg('Failed to mark attendance.');
      });
  };

  const handleDownloadTemplate = () => {
    if (!selectedExam || !selectedClass) {
      setCsvStatus('Please select both exam and class.');
      return;
    }
    setCsvStatus('');
    const token = localStorage.getItem('access');
    fetch(`${API}/marks/template/?exam=${selectedExam}&classroom=${selectedClass}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to download template');
        return res.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'marks_template.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => setCsvStatus('Failed to download template.'));
  };

  const handleCsvUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!selectedExam || !selectedClass) {
      setCsvStatus('Please select both exam and class before uploading.');
      return;
    }
    setCsvStatus('Uploading...');
    setCsvErrors([]);
    const token = localStorage.getItem('access');
    const formData = new FormData();
    formData.append('exam', selectedExam);
    formData.append('classroom', selectedClass);
    formData.append('file', file);
    fetch(`${API}/marks/upload/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setCsvStatus(`Upload successful. Created: ${data.created}, Updated: ${data.updated}`);
          setCsvErrors(data.errors || []);
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          setCsvStatus('Upload failed.');
          setCsvErrors(data.errors || [data.detail || 'Unknown error']);
        }
      })
      .catch(() => setCsvStatus('Upload failed.'));
  };

  // Remove all profile picture upload and display logic

  const getSubjectName = id => {
    const subj = subjects.find(s => s.id === id);
    return subj ? subj.name : id;
  };
  const getClassName = id => {
    const cls = classes.find(c => c.id === id);
    return cls ? cls.name : id;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (error) return <div className="student-dashboard-error">{error}</div>;
  if (!profile) return <div className="student-dashboard-loading">Loading...</div>;

  return (
    <div className="student-dashboard-container">
      <button className="student-logout-btn" onClick={handleLogout}>Logout</button>
      <h1 className="student-dashboard-title">👨‍🏫 Teacher Dashboard</h1>
      <section className="student-profile-section">
        <h2>Profile</h2>
        <table className="student-profile-table">
          <tbody>
            <tr><th>Username</th><td>{profile.username}</td></tr>
            <tr><th>Email</th><td>{profile.email}</td></tr>
            <tr><th>Role</th><td>{profile.role}</td></tr>
          </tbody>
        </table>
      </section>
      {classTeacherOf.length > 0 && (
        <section className="student-marks-section">
          <h2>Class Teacher For</h2>
          <ul>
            {Array.isArray(classTeacherOf) ? classTeacherOf.map(c => (
              <li key={c.id}>{c.name}</li>
            )) : null}
          </ul>
        </section>
      )}
      {classTeacherOf.length > 0 && (
        <section className="student-marks-section">
          <h2>Class Attendance</h2>
          <table className="student-marks-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(classAttendance) ? classAttendance.length === 0 ? (
                <tr><td colSpan="4">No attendance records found.</td></tr>
              ) : classAttendance.map((att, i) => (
                <tr key={i}>
                  <td>{att.student}</td>
                  <td>{att.date}</td>
                  <td>{att.time_in}</td>
                  <td>{att.time_out}</td>
                </tr>
              )) : null}
            </tbody>
          </table>
        </section>
      )}
      {classTeacherOf.length > 0 && (
        <section className="student-marks-section">
          <h2>Mark Attendance</h2>
          {attendanceMsg && <div style={{ color: attendanceMsg.includes('success') ? 'green' : 'red' }}>{attendanceMsg}</div>}
          {attendanceLoading && <div>Marking attendance...</div>}
          <table className="student-marks-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Admission No</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(studentsInClass) ? studentsInClass.length === 0 ? (
                <tr><td colSpan="3">No students found in your class.</td></tr>
              ) : studentsInClass.map(s => (
                <tr key={s.id}>
                  <td>{s.full_name}</td>
                  <td>{s.admission_no}</td>
                  <td>
                    <button onClick={() => markAttendance(s.admission_no)} disabled={attendanceLoading}>Mark Attendance</button>
                  </td>
                </tr>
              )) : null}
            </tbody>
          </table>
        </section>
      )}
      {classTeacherOf.length > 0 && (
        <section className="student-marks-section">
          <h2>Exam Results (CSV Upload)</h2>
          <div style={{ marginBottom: 12 }}>
            <label>Exam: </label>
            <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
              <option value="">Select Exam</option>
              {Array.isArray(exams) ? exams.map(e => (
                <option key={e.id} value={e.id}>{e.name} ({e.term} {e.year})</option>
              )) : null}
            </select>
            <label style={{ marginLeft: 16 }}>Class: </label>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
              <option value="">Select Class</option>
              {Array.isArray(classTeacherOf) ? classTeacherOf.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              )) : null}
            </select>
            <button style={{ marginLeft: 16 }} onClick={handleDownloadTemplate}>Download Template</button>
          </div>
          <div style={{ marginBottom: 12 }}>
            <input type="file" accept=".csv" ref={fileInputRef} onChange={handleCsvUpload} />
          </div>
          {csvStatus && <div style={{ color: csvStatus.includes('success') ? 'green' : 'red' }}>{csvStatus}</div>}
          {csvErrors.length > 0 && (
            <ul style={{ color: 'red' }}>{csvErrors.map((err, i) => <li key={i}>{err}</li>)}</ul>
          )}
        </section>
      )}
      <section className="student-marks-section">
        <h2>Assigned Subjects & Classes</h2>
        <table className="student-marks-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(teacherAssignments) ? teacherAssignments.length === 0 ? (
              <tr><td colSpan="2">No assignments found.</td></tr>
            ) : teacherAssignments.map(a => (
              <tr key={a.id}>
                <td>{getSubjectName(a.subject)}</td>
                <td>{getClassName(a.classroom)}</td>
              </tr>
            )) : null}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default TeacherDashboard; 