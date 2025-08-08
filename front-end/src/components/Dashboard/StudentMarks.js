import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { downloadPDF } from '../../utils/pdfGenerator';
import { useAuth } from '../../AuthContext';

const StudentMarks = () => {
  const { marks, subjects, exams, profile } = useOutletContext();
  const { user } = useAuth();
  const [generatingPDFs, setGeneratingPDFs] = useState({});
  const [pdfErrors, setPdfErrors] = useState({});

  const handleDownloadPDF = async (examId, examName) => {
    setGeneratingPDFs(prev => ({ ...prev, [examId]: true }));
    setPdfErrors(prev => ({ ...prev, [examId]: '' }));
    
    try {
      const API = process.env.REACT_APP_API_BASE_URL;
      console.log('Attempting to download PDF for exam:', examName);
      await downloadPDF(`${API}/my-result-pdf/?exam_id=${examId}`);
    } catch (error) {
      console.error('PDF generation error:', error);
      if (error.message.includes('Authentication failed')) {
        setPdfErrors(prev => ({ ...prev, [examId]: 'Authentication failed. Please log in again.' }));
      } else {
        setPdfErrors(prev => ({ ...prev, [examId]: `Failed to generate PDF: ${error.message}` }));
      }
    } finally {
      setGeneratingPDFs(prev => ({ ...prev, [examId]: false }));
    }
  };

  return (
    <section className="student-marks-section">
      <div className="student-marks-header">
      <h2>Marks</h2>
      </div>
      
      <div className="student-marks-table-wrapper">
        <table className="student-marks-table">
          <thead>
            <tr>
              <th title="Exam">Exam</th>
              {Array.isArray(subjects) ? subjects.map(subject => (
                <th key={subject.id} title={subject.name}>{subject.name}</th>
              )) : null}
              <th title="Total">Total</th>
              <th title="Average">Average</th>
              <th title="Grade">Grade</th>
              <th title="Actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(exams) && exams.length === 0 ? (
              <tr><td colSpan={4 + (Array.isArray(subjects) ? subjects.length : 0)}>No exams found.</td></tr>
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
              
              const examName = `${exam.name} (Term ${exam.term} ${exam.year})`;
              
              return (
                <tr key={exam.id}>
                  <td>{examName}</td>
                  {Array.isArray(subjects) ? subjects.map(subject => (
                    <td key={subject.id}>{subjectMarkMap[subject.id] !== undefined ? subjectMarkMap[subject.id] : '-'}</td>
                  )) : null}
                  <td>{total}</td>
                  <td>{average.toFixed(2)}</td>
                  <td>{grade}</td>
                  <td>
                    <button 
                      className="exam-pdf-download-btn"
                      onClick={() => handleDownloadPDF(exam.id, examName)}
                      disabled={generatingPDFs[exam.id]}
                    >
                      {generatingPDFs[exam.id] ? 'Generating...' : '📄 PDF'}
                    </button>
                    {pdfErrors[exam.id] && (
                      <div className="exam-pdf-error">
                        {pdfErrors[exam.id]}
                      </div>
                    )}
                  </td>
                </tr>
              );
            }) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default StudentMarks; 