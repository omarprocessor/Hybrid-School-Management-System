import React, { useEffect, useState } from 'react';
import { authFetch } from '../../utils';

const API = process.env.REACT_APP_API_BASE_URL;

const AdminMarks = () => {
  const [marks, setMarks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      authFetch(`${API}/marks/`).then(res => res.ok ? res.json() : []),
      authFetch(`${API}/classrooms/`).then(res => res.ok ? res.json() : []),
      authFetch(`${API}/subjects/`).then(res => res.ok ? res.json() : []),
      authFetch(`${API}/students/`).then(res => res.ok ? res.json() : []),
      authFetch(`${API}/exams/`).then(res => res.ok ? res.json() : [])
    ]).then(([marksData, classesData, subjectsData, studentsData, examsData]) => {
      setMarks(marksData);
      setClasses(classesData);
      setSubjects(subjectsData);
      setStudents(studentsData);
      setExams(examsData);
      setLoading(false);
    });
  }, []);

  // Filter students by class
  const filteredStudents = selectedClass ? students.filter(s => s.classroom === parseInt(selectedClass)) : students;

  // Filter marks by selected class, student, and exam
  const filteredMarks = marks.filter(mark => {
    const student = students.find(s => s.id === mark.student);
    const classMatch = selectedClass ? student?.classroom === parseInt(selectedClass) : true;
    const studentMatch = selectedStudent ? mark.student === parseInt(selectedStudent) : true;
    const examMatch = selectedExam ? mark.exam === parseInt(selectedExam) : true;
    return classMatch && studentMatch && examMatch;
  });

  const getStudentName = id => {
    const s = students.find(stu => stu.id === id);
    return s ? s.full_name : id;
  };

  // Determine which exams to show as rows
  const examsToShow = selectedExam ? exams.filter(e => e.id === parseInt(selectedExam)) : exams;

  return (
    <section className="admin-marks-section">
      <h2>Marks</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedStudent(''); }}>
          <option value="">All Classes</option>
          {Array.isArray(classes) ? classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          )) : null}
        </select>
        <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
          <option value="">All Students</option>
          {Array.isArray(filteredStudents) ? filteredStudents.map(stu => (
            <option key={stu.id} value={stu.id}>{stu.full_name}</option>
          )) : null}
        </select>
        <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
          <option value="">All Exams</option>
          {Array.isArray(exams) ? exams.map(exam => (
            <option key={exam.id} value={exam.id}>{exam.name} (Term {exam.term} {exam.year})</option>
          )) : null}
        </select>
      </div>
      {loading ? <div>Loading...</div> : (
        <table className="admin-marks-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Admission No</th>
              {Array.isArray(subjects) ? subjects.map(subject => (
                <th key={subject.id}>{subject.name}</th>
              )) : null}
              <th>Total</th>
              <th>Average</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {examsToShow.length === 0 ? (
              <tr><td colSpan={4 + (Array.isArray(subjects) ? subjects.length : 0)}>No exams found.</td></tr>
            ) : Array.isArray(examsToShow) ? examsToShow.map(exam => {
              // For each student in the filter, show a row
              const studentsToShow = selectedStudent ? filteredStudents.filter(s => s.id === parseInt(selectedStudent)) : filteredStudents;
              return Array.isArray(studentsToShow) ? studentsToShow.map(student => {
                const examMarks = filteredMarks.filter(mark => mark.exam === exam.id && mark.student === student.id);
                const subjectMarkMap = {};
                examMarks.forEach(mark => {
                  subjectMarkMap[mark.subject] = mark.exam_score;
                });
                // Check if all marks are missing or zero
                const allEmpty = Array.isArray(subjects) ? subjects.every(subject => {
                  const val = subjectMarkMap[subject.id];
                  return val === undefined || val === 0 || val === '-' || val === null;
                }) : true;
                if (allEmpty) return null;
                const total = examMarks.reduce((sum, mark) => sum + (mark.exam_score || 0), 0);
                const count = Array.isArray(subjects) ? subjects.length : 0;
                const average = count > 0 ? (total / count) : 0;
                let grade = 'E';
                if (average >= 80) grade = 'A';
                else if (average >= 70) grade = 'B+';
                else if (average >= 60) grade = 'B';
                else if (average >= 50) grade = 'C';
                else if (average >= 40) grade = 'D';
                return (
                  <tr key={exam.id + '-' + student.id}>
                    <td>{student.full_name}</td>
                    <td>{student.admission_no}</td>
                    {Array.isArray(subjects) ? subjects.map(subject => (
                      <td key={subject.id}>{subjectMarkMap[subject.id] !== undefined ? subjectMarkMap[subject.id] : '-'}</td>
                    )) : null}
                    <td>{total}</td>
                    <td>{average.toFixed(2)}</td>
                    <td>{grade}</td>
                  </tr>
                );
              }) : null;
            }) : null}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default AdminMarks; 