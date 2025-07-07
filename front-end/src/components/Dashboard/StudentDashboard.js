import React, { useEffect, useState } from 'react'
import DashboardLayout from './DashboardLayout'

const StudentDashboard = () => {
const [students, setStudents] = useState([])

useEffect(() => {
  fetch(`${process.env.REACT_APP_API_BASE_URL}/students/`)
    .then(res => res.json())
    .then(data => setStudents(data))
    .catch(err => console.error(err))
}, [])

return (
<DashboardLayout>
  <h1>👨‍🎓 Students</h1>
  <table>
    <thead>
      <tr>
        <th>Full Name</th>
        <th>Admission No</th>
        <th>Class</th>
        <th>Parent Phone</th>
      </tr>
    </thead>
    <tbody>
      {students.map(student => (
        <tr key={student.id}>
          <td>{student.full_name}</td>
          <td>{student.admission_no}</td>
          <td>{student.classroom}</td>
          <td>{student.parent_phone}</td>
        </tr>
      ))}
    </tbody>
  </table>
</DashboardLayout>
)
}

export default StudentDashboard
