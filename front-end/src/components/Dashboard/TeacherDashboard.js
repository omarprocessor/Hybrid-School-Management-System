import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { authFetch } from '../../utils';
import './TeacherDashboard.css';

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
  const [attendanceLoading, setAttendanceLoading] = useState({});
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [csvStatus, setCsvStatus] = useState('');
  const [csvErrors, setCsvErrors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    // Since this component is wrapped in ProtectedRoute, user should always exist
    if (!user || user.role !== 'teacher') {
      navigate('/login');
      return;
    }
    
    authFetch(`${API}/me/`)
      .then(res => {
        if (!res.ok) throw new Error('Could not fetch profile');
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => setError(err.message));
  }, [user, navigate]);

  // Fetch teacherId after profile is loaded
  useEffect(() => {
    if (!user || !profile) return;
    authFetch(`${API}/teachers/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        let teacher = data.find(t => t.user === profile.id);
        
        // If user is approved as teacher but no Teacher record exists, create one
        if (!teacher && profile.role === 'teacher' && profile.is_approved) {
          console.log('Creating Teacher record for approved teacher user');
          authFetch(`${API}/teachers/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user: profile.id,
              full_name: profile.username
            })
          })
          .then(res => res.ok ? res.json() : null)
          .then(newTeacher => {
            if (newTeacher) {
              console.log('Created new Teacher record:', newTeacher);
              setTeacherId(newTeacher.id);
            }
          })
          .catch(err => {
            console.error('Failed to create Teacher record:', err);
          });
        } else {
          setTeacherId(teacher ? teacher.id : null);
        }
      })
      .catch(err => {
        console.error('Teachers API error:', err);
        setTeacherId(null);
      });
  }, [user, profile]);

  useEffect(() => {
    if (!user) return;
    authFetch(`${API}/assignments/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setAssignments(data))
      .catch(err => {
        console.error('Assignments API error:', err);
        setAssignments([]);
      });
    authFetch(`${API}/subjects/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setSubjects(data))
      .catch(err => {
        console.error('Subjects API error:', err);
        setSubjects([]);
      });
    authFetch(`${API}/classrooms/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setClasses(data))
      .catch(err => {
        console.error('Classes API error:', err);
        setClasses([]);
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    authFetch(`${API}/exams/`).then(res => res.ok ? res.json() : []).then(setExams).catch(() => setExams([]));
  }, [user]);

  // Filter assignments for this teacher (by teacher id)
  const teacherAssignments = teacherId
    ? assignments.filter(a => parseInt(a.teacher) === parseInt(teacherId) || a.teacher === teacherId)
    : [];

  // Find classes where this teacher is the class teacher
  const classTeacherOf = teacherId && classes.length > 0
    ? classes.filter(c => c.class_teacher && (parseInt(c.class_teacher.id) === parseInt(teacherId) || c.class_teacher.id === teacherId))
    : [];

  // Fetch class attendance for class teacher
  useEffect(() => {
    if (!user || !teacherId) return;
    authFetch(`${API}/my-class-attendance/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setClassAttendance(Array.isArray(data) ? data : []))
      .catch(() => setClassAttendance([]));
  }, [user, teacherId]);

  // Fetch students in the class if classTeacherOf exists
  useEffect(() => {
    if (!user || classTeacherOf.length === 0) return;
    // Assume only one class for class teacher
    const classId = classTeacherOf[0].id;
    authFetch(`${API}/students/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setStudentsInClass(data.filter(s => parseInt(s.classroom) === parseInt(classId) || s.classroom === classId));
      })
      .catch(() => setStudentsInClass([]));
  }, [user, classTeacherOf]);

  // Mark attendance for a specific student
  const markAttendance = async (admission_no, studentName) => {
    if (!admission_no) {
      setAttendanceMsg('Please provide a valid admission number.');
      return;
    }
    
    setAttendanceLoading(prev => ({ ...prev, [admission_no]: true }));
    setAttendanceMsg('');
    
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`${API}/attendance/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ admission_no })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAttendanceMsg(`${studentName} - Attendance marked successfully!`);
        // Refresh attendance data
        authFetch(`${API}/my-class-attendance/`)
          .then(res => res.ok ? res.json() : [])
          .then(data => setClassAttendance(Array.isArray(data) ? data : []))
          .catch(() => setClassAttendance([]));
      } else {
        setAttendanceMsg(`${studentName} - ${data.detail || data.error || 'Failed to mark attendance.'}`);
      }
    } catch (error) {
      setAttendanceMsg(`${studentName} - Network error. Please try again.`);
    } finally {
      setAttendanceLoading(prev => ({ ...prev, [admission_no]: false }));
    }
  };

  // Get attendance status for a student
  const getStudentAttendanceStatus = (student) => {
    const today = new Date().toISOString().split('T')[0];
    const studentAttendance = classAttendance.filter(att => 
      att.student === student.full_name && att.date === today
    );
    
    if (studentAttendance.length === 0) {
      return { status: 'Not Marked', className: 'absent' };
    }
    
    const latestAttendance = studentAttendance[studentAttendance.length - 1];
    if (latestAttendance.time_out) {
      return { status: 'Present', className: 'present' };
    } else {
      return { status: 'Checked In', className: 'late' };
    }
  };

  const handleDownloadTemplate = async () => {
    if (!selectedExam || !selectedClass) {
      setCsvStatus('Please select both exam and class.');
      return;
    }
    
    setCsvStatus('');
    setUploadError('');
    
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`${API}/marks/template/?exam=${selectedExam}&classroom=${selectedClass}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download template');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'marks_template.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setCsvStatus('Template downloaded successfully!');
    } catch (error) {
      setCsvStatus('Failed to download template. Please try again.');
    }
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!selectedExam || !selectedClass) {
      setCsvStatus('Please select both exam and class before uploading.');
      return;
    }
    
    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setCsvStatus('Please select a valid CSV file.');
      return;
    }
    
    setUploading(true);
    setCsvStatus('Uploading...');
    setCsvErrors([]);
    setUploadError('');
    
    try {
      const token = localStorage.getItem('access');
      const formData = new FormData();
      formData.append('exam', selectedExam);
      formData.append('classroom', selectedClass);
      formData.append('file', file);
      
      const response = await fetch(`${API}/marks/upload/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCsvStatus(`Upload successful! Created: ${data.created}, Updated: ${data.updated}`);
        setCsvErrors(data.errors || []);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setCsvStatus('Upload failed.');
        setCsvErrors(data.errors || [data.detail || 'Unknown error']);
      }
    } catch (error) {
      setCsvStatus('Upload failed. Network error.');
      setUploadError('Network error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  const getSubjectName = id => {
    const subj = subjects.find(s => s.id === id);
    return subj ? subj.name : id;
  };
  
  const getClassName = id => {
    const cls = classes.find(c => c.id === id);
    return cls ? cls.name : id;
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/';
  };

  if (error) {
    return (
      <div className="teacher-dashboard-layout">
        <div className="teacher-main-content">
          <div className="teacher-alert error">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="teacher-dashboard-layout">
        <div className="teacher-main-content">
          <div className="teacher-loading">
            Loading teacher profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard-layout">
      <aside className="teacher-sidebar">
        <h2 className="teacher-sidebar-title">Teacher Dashboard</h2>
        <nav className="teacher-sidebar-nav">
          <button className="teacher-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Dashboard Overview
          </button>
          <button className="teacher-btn" onClick={() => document.getElementById('attendance-section')?.scrollIntoView({ behavior: 'smooth' })}>
            Mark Attendance
          </button>
          <button className="teacher-btn" onClick={() => document.getElementById('marks-section')?.scrollIntoView({ behavior: 'smooth' })}>
            Upload Marks
          </button>
          <button className="teacher-btn" onClick={() => document.getElementById('assignments-section')?.scrollIntoView({ behavior: 'smooth' })}>
            My Assignments
          </button>
        </nav>
        <button className="teacher-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="teacher-main-content">
        <div className="teacher-dashboard-container">
          <div className="teacher-dashboard-header">
            <h1>Welcome, {profile.username}</h1>
            <p>Manage your classes, mark attendance, and upload student marks</p>
          </div>

          {/* Teacher Stats */}
          <div className="teacher-stats">
            <div className="teacher-stat-card">
              <span className="teacher-stat-number">{teacherAssignments.length}</span>
              <span className="teacher-stat-label">Active Assignments</span>
            </div>
            <div className="teacher-stat-card">
              <span className="teacher-stat-number">{classTeacherOf.length}</span>
              <span className="teacher-stat-label">Class Teacher Of</span>
            </div>
            <div className="teacher-stat-card">
              <span className="teacher-stat-number">{studentsInClass.length}</span>
              <span className="teacher-stat-label">Students in Class</span>
            </div>
            <div className="teacher-stat-card">
              <span className="teacher-stat-number">{exams.length}</span>
              <span className="teacher-stat-label">Available Exams</span>
            </div>
          </div>

          {/* Attendance Section */}
          <div id="attendance-section" className="teacher-section">
            <h2>Mark Attendance</h2>
            {classTeacherOf.length > 0 ? (
              <div>
                {attendanceMsg && (
                  <div className={`teacher-alert ${attendanceMsg.includes('successfully') ? 'success' : 'error'}`}>
                    {attendanceMsg}
                  </div>
                )}

                <div className="teacher-card">
                  <div className="teacher-card-header">
                    <h3 className="teacher-card-title">Class Students Attendance</h3>
                    <span className="teacher-card-subtitle">
                      {classTeacherOf[0]?.name} - {studentsInClass.length} Students
                    </span>
                  </div>
                  <div className="teacher-card-content">
                    {studentsInClass.length > 0 ? (
                      <div className="table-container">
                        <table className="teacher-table">
                          <thead>
                            <tr>
                              <th>Admission No</th>
                              <th>Student Name</th>
                              <th>Today's Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentsInClass.map(student => {
                              const attendanceStatus = getStudentAttendanceStatus(student);
                              const isLoading = attendanceLoading[student.admission_no];
                              
                              return (
                                <tr key={student.id}>
                                  <td>{student.admission_no}</td>
                                  <td>{student.full_name}</td>
                                  <td>
                                    <span className={`teacher-status ${attendanceStatus.className}`}>
                                      {attendanceStatus.status}
                                    </span>
                                  </td>
                                  <td>
                                    <button 
                                      className="teacher-btn teacher-btn-success"
                                      onClick={() => markAttendance(student.admission_no, student.full_name)}
                                      disabled={isLoading}
                                      style={{ padding: '8px 16px', fontSize: '14px' }}
                                    >
                                      {isLoading ? 'Marking...' : 'Mark Attendance'}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>No students found in this class.</p>
                    )}
                  </div>
                </div>

                <div className="teacher-card">
                  <div className="teacher-card-header">
                    <h3 className="teacher-card-title">Recent Class Attendance</h3>
                  </div>
                  <div className="teacher-card-content">
                    {classAttendance.length > 0 ? (
                      <div className="table-container">
                        <table className="teacher-table">
                          <thead>
                            <tr>
                              <th>Student</th>
                              <th>Date</th>
                              <th>Time In</th>
                              <th>Time Out</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {classAttendance.slice(0, 10).map(att => (
                              <tr key={att.id}>
                                <td>{att.student || 'Unknown'}</td>
                                <td>{new Date(att.date).toLocaleDateString()}</td>
                                <td>{att.time_in ? new Date(`2000-01-01T${att.time_in}`).toLocaleTimeString() : 'N/A'}</td>
                                <td>{att.time_out ? new Date(`2000-01-01T${att.time_out}`).toLocaleTimeString() : 'N/A'}</td>
                                <td>
                                  <span className={`teacher-status ${att.time_out ? 'present' : 'late'}`}>
                                    {att.time_out ? 'Present' : 'Checked In'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>No recent attendance records found.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="teacher-alert info">
                You are not assigned as a class teacher. Contact the administrator for class teacher assignments.
              </div>
            )}
          </div>

          {/* Marks Upload Section */}
          <div id="marks-section" className="teacher-section">
            <h2>Upload Student Marks</h2>
            
            <div className="teacher-form-group">
              <label>Select Exam:</label>
              <select 
                value={selectedExam} 
                onChange={(e) => setSelectedExam(e.target.value)}
                disabled={uploading}
              >
                <option value="">Choose an exam...</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name} - {exam.subject_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="teacher-form-group">
              <label>Select Class:</label>
              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={uploading}
              >
                <option value="">Choose a class...</option>
                {teacherAssignments.length > 0 ? (
                  teacherAssignments.map(assignment => {
                    const classInfo = classes.find(c => c.id === parseInt(assignment.classroom) || c.id === assignment.classroom);
                    const className = assignment.classroom_name || (classInfo ? classInfo.name : `Class ${assignment.classroom}`);
                    return (
                      <option key={assignment.id} value={assignment.classroom}>
                        {className}
                      </option>
                    );
                  })
                ) : (
                  <option value="" disabled>No classes assigned to you</option>
                )}
              </select>
            </div>

            {selectedExam && selectedClass && (
              <div className="teacher-file-upload" onClick={() => fileInputRef.current?.click()}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  style={{ display: 'none' }}
                />
                <div className="teacher-file-upload-label">
                  Click to upload CSV file
                </div>
                <div className="teacher-file-upload-text">
                  Download template first to ensure correct format
                </div>
              </div>
            )}

            <div className="teacher-form-group">
              <button 
                className="teacher-btn teacher-btn-secondary" 
                onClick={handleDownloadTemplate}
                disabled={!selectedExam || !selectedClass || uploading}
              >
                Download CSV Template
              </button>
            </div>

            {csvStatus && (
              <div className={`teacher-alert ${csvStatus.includes('success') ? 'success' : 'error'}`}>
                {csvStatus}
              </div>
            )}

            {csvErrors.length > 0 && (
              <div className="teacher-alert error">
                <strong>Upload Errors:</strong>
                <ul>
                  {csvErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {uploading && (
              <div className="teacher-loading">
                Uploading marks...
              </div>
            )}

            {uploadError && (
              <div className="teacher-alert error">
                {uploadError}
              </div>
            )}
          </div>

          {/* Assignments Section */}
          <div id="assignments-section" className="teacher-section">
            <h2>My Assignments</h2>
            {teacherAssignments.length > 0 ? (
              <div className="teacher-grid">
                {teacherAssignments.map(assignment => {
                  const classInfo = classes.find(c => c.id === assignment.classroom);
                  const subjectInfo = subjects.find(s => s.id === assignment.subject);
                  return (
                    <div key={assignment.id} className="teacher-card">
                      <div className="teacher-card-header">
                        <h3 className="teacher-card-title">
                          {classInfo ? classInfo.name : `Class ${assignment.classroom}`}
                        </h3>
                      </div>
                      <div className="teacher-card-content">
                        <p><strong>Subject:</strong> {subjectInfo ? subjectInfo.name : `Subject ${assignment.subject}`}</p>
                        <p><strong>Assignment ID:</strong> {assignment.id}</p>
                        {classInfo && classInfo.class_teacher && classInfo.class_teacher.id === teacherId && (
                          <p><strong>Role:</strong> Class Teacher</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="teacher-alert info">
                No assignments found. Contact the administrator to get assigned to classes and subjects.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard; 