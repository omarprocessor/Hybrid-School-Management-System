import React from 'react';
import { useOutletContext } from 'react-router-dom';

const StudentMarks = () => {
  const { marks, subjects, exams } = useOutletContext();
  return (
    <section className="student-marks-section">
      <h2>Marks</h2>
      <table className="student-marks-table">
        <thead>
          <tr>
            <th>Exam</th>
            {Array.isArray(subjects) ? subjects.map(subject => (
              <th key={subject.id}>{subject.name}</th>
            )) : null}
            <th>Total</th>
            <th>Average</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(exams) && exams.length === 0 ? (
            <tr><td colSpan={3 + (Array.isArray(subjects) ? subjects.length : 0)}>No exams found.</td></tr>
          ) : Array.isArray(exams) ? exams.map(exam => {
            const examMarks = Array.isArray(marks) ? marks.filter(mark => mark.exam === exam.id) : [];
            const subjectMarkMap = {};
            if (Array.isArray(examMarks)) {
              examMarks.forEach(mark => {
                subjectMarkMap[mark.subject] = mark.exam_score;
              });
            }
            // Check if all marks are missing or zero
            const allEmpty = Array.isArray(subjects) ? subjects.every(subject => {
              const val = subjectMarkMap[subject.id];
              return val === undefined || val === 0 || val === '-' || val === null;
            }) : true;
            if (allEmpty) return null;
            const total = Array.isArray(examMarks) ? examMarks.reduce((sum, mark) => sum + (mark.exam_score || 0), 0) : 0;
            const count = Array.isArray(subjects) ? subjects.length : 0;
            const average = count > 0 ? (total / count) : 0;
            let grade = 'E';
            if (average >= 80) grade = 'A';
            else if (average >= 70) grade = 'B+';
            else if (average >= 60) grade = 'B';
            else if (average >= 50) grade = 'C';
            else if (average >= 40) grade = 'D';
            return (
              <tr key={exam.id}>
                <td>{exam.name} (Term {exam.term} {exam.year})</td>
                {Array.isArray(subjects) ? subjects.map(subject => (
                  <td key={subject.id}>{subjectMarkMap[subject.id] !== undefined ? subjectMarkMap[subject.id] : '-'}</td>
                )) : null}
                <td>{total}</td>
                <td>{average.toFixed(2)}</td>
                <td>{grade}</td>
              </tr>
            );
          }) : null}
        </tbody>
      </table>
    </section>
  );
};

export default StudentMarks; 