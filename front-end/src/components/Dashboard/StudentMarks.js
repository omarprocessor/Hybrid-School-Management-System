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
            {subjects.map(subject => (
              <th key={subject.id}>{subject.name}</th>
            ))}
            <th>Total</th>
            <th>Average</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {exams.length === 0 ? (
            <tr><td colSpan={3 + subjects.length}>No exams found.</td></tr>
          ) : exams.map(exam => {
            const examMarks = marks.filter(mark => mark.exam === exam.id);
            const subjectMarkMap = {};
            examMarks.forEach(mark => {
              subjectMarkMap[mark.subject] = mark.exam_score;
            });
            const total = examMarks.reduce((sum, mark) => sum + (mark.exam_score || 0), 0);
            const count = subjects.length;
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
                {subjects.map(subject => (
                  <td key={subject.id}>{subjectMarkMap[subject.id] !== undefined ? subjectMarkMap[subject.id] : '-'}</td>
                ))}
                <td>{total}</td>
                <td>{average.toFixed(2)}</td>
                <td>{grade}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default StudentMarks; 