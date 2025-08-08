import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { authFetch } from '../utils'

export const generateStudentResultPDF = async (data) => {
const { school_info, student, subjects, exams, exam_marks } = data
const doc = new jsPDF({ margin: 5 })

doc.setProperties({
title: `${student.name} - Academic Report`,
subject: 'Student Academic Report',
author: school_info.school_name,
creator: school_info.school_name
})

let profileImageLoaded = false
if (student.profile_pic_url) {
try {
const response = await fetch(student.profile_pic_url)
if (response.ok) {
const blob = await response.blob()
const arrayBuffer = await blob.arrayBuffer()
const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
const imgData = `data:image/jpeg;base64,${base64}`
doc.addImage(imgData, 'JPEG', 170, 10, 30, 40)
profileImageLoaded = true
}
} catch (error) {
console.log('Error loading profile picture:', error)
}
}

if (!profileImageLoaded) {
doc.rect(170, 10, 30, 40)
doc.setFontSize(7)
doc.text('STUDENT', 183, 25, { align: 'center' })
doc.text('PHOTO', 183, 32, { align: 'center' })
}

doc.setFontSize(14)
doc.setFont('helvetica', 'bold')
doc.text(school_info.school_name.toUpperCase(), 105, 15, { align: 'center' })

doc.setFontSize(7)
doc.setFont('helvetica', 'normal')
doc.text(school_info.po_box, 80, 28)
doc.text(school_info.phone, 80, 33)
doc.text(`Location: ${school_info.location}`, 80, 38)
doc.text(`Email: ${school_info.email}`, 80, 43)

// Add school logo if available
let schoolLogoLoaded = false
if (school_info.logo_url) {
console.log('Attempting to load school logo from:', school_info.logo_url)
try {
// Try to load the image with proper CORS headers
const response = await fetch(school_info.logo_url, {
method: 'GET',
mode: 'cors',
headers: {
'Accept': 'image/*',
},
})
console.log('Logo fetch response status:', response.status)
if (response.ok) {
const blob = await response.blob()
console.log('Logo blob size:', blob.size, 'type:', blob.type)
const arrayBuffer = await blob.arrayBuffer()
const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
// Determine image format from blob type
let imageFormat = 'JPEG'
if (blob.type.includes('png')) {
imageFormat = 'PNG'
} else if (blob.type.includes('gif')) {
imageFormat = 'GIF'
} else if (blob.type.includes('webp')) {
imageFormat = 'WEBP'
}
const imgData = `data:${blob.type};base64,${base64}`
doc.addImage(imgData, imageFormat, 20, 15, 30, 20)
schoolLogoLoaded = true
console.log('School logo loaded successfully with format:', imageFormat)
} else {
console.log('Failed to fetch logo, status:', response.status, 'statusText:', response.statusText)
// Try alternative approach with XMLHttpRequest
console.log('Trying alternative approach...')
await loadLogoWithXHR(school_info.logo_url)
}
} catch (error) {
console.log('Error loading school logo with fetch:', error)
// Try alternative approach
try {
await loadLogoWithXHR(school_info.logo_url)
} catch (xhrError) {
console.log('Error loading school logo with XHR:', xhrError)
}
}
} else {
console.log('No school logo URL provided')
}

// Alternative method using XMLHttpRequest for better CORS handling
async function loadLogoWithXHR(url) {
return new Promise((resolve, reject) => {
const xhr = new XMLHttpRequest()
xhr.open('GET', url, true)
xhr.responseType = 'blob'
xhr.onload = function() {
if (xhr.status === 200) {
const blob = xhr.response
console.log('XHR Logo blob size:', blob.size, 'type:', blob.type)
const reader = new FileReader()
reader.onload = function(e) {
const base64 = e.target.result.split(',')[1]
let imageFormat = 'JPEG'
if (blob.type.includes('png')) {
imageFormat = 'PNG'
} else if (blob.type.includes('gif')) {
imageFormat = 'GIF'
}
const imgData = `data:${blob.type};base64,${base64}`
doc.addImage(imgData, imageFormat, 20, 15, 30, 20)
schoolLogoLoaded = true
console.log('School logo loaded successfully with XHR, format:', imageFormat)
resolve()
}
reader.readAsDataURL(blob)
} else {
console.log('XHR failed, status:', xhr.status)
reject(new Error(`XHR failed with status ${xhr.status}`))
}
}
xhr.onerror = function() {
console.log('XHR error occurred')
reject(new Error('XHR error occurred'))
}
xhr.send()
})
}

if (!schoolLogoLoaded) {
// Create a fallback school logo placeholder
doc.rect(20, 15, 30, 20)
doc.setFillColor(63, 81, 181) // Primary color
doc.rect(20, 15, 30, 20, 'F')
doc.setFillColor(255, 255, 255) // White text
doc.setFontSize(6)
doc.text('SCHOOL', 33, 25, { align: 'center' })
doc.text('LOGO', 33, 30, { align: 'center' })
console.log('Using fallback school logo placeholder')
}

doc.setFontSize(12)
doc.setFont('helvetica', 'bold')
doc.text('ACADEMIC REPORT', 105, 55, { align: 'center' })

const exam = exams[0]
doc.setFontSize(8)
doc.text(`Term: ${exam.term}`, 160, 55)
doc.text(`Year: ${exam.year}`, 160, 60)

// Student Information Table
doc.setFontSize(10)
doc.setFont('helvetica', 'bold')
doc.text('Student Information:', 20, 70)

autoTable(doc, {
head: [['Adm No', 'Name', 'Class', 'Gender']],
body: [[
student.admission_no,
student.name,
student.classroom,
student.gender === 'M' ? 'Male' : 'Female'
]],
startY: 74,
styles: {
fontSize: 8,
halign: 'center',
valign: 'middle'
},
headStyles: {
fillColor: [41, 128, 185],
textColor: 255,
fontStyle: 'bold'
},
margin: { left: 20, right: 20 },
theme: 'grid'
})

// Performance Summary Table
const examData = Object.values(exam_marks)[0]
const totalMarks = examData.total
const averageMarks = examData.average
const overallGrade = examData.grade
const totalPossibleMarks = subjects.length * 100
const percentage = (totalMarks / totalPossibleMarks) * 100

doc.setFontSize(10)
doc.setFont('helvetica', 'bold')
doc.text('Performance Summary:', 20, doc.lastAutoTable.finalY + 10)

autoTable(doc, {
head: [['Total Marks', 'Average', 'Percentage', 'Grade']],
body: [[
`${totalMarks} / ${totalPossibleMarks}`,
averageMarks.toFixed(2),
`${percentage.toFixed(1)}%`,
overallGrade
]],
startY: doc.lastAutoTable.finalY + 14,
styles: {
fontSize: 8,
halign: 'center',
valign: 'middle'
},
headStyles: {
fillColor: [41, 128, 185],
textColor: 255,
fontStyle: 'bold'
},
margin: { left: 20, right: 20 },
theme: 'grid'
})

// Subject Performance Table
doc.setFontSize(10)
doc.setFont('helvetica', 'bold')
doc.text('Subject Performance:', 20, doc.lastAutoTable.finalY + 10)

const tableData = []
const headers = ['Subject', 'Marks (out of 100)', 'Grade', 'Points', 'Remarks']

subjects.forEach(subject => {
const mark = examData.marks[subject.id]
const score = mark !== undefined ? mark : '-'
let subjectGrade = '-'
let points = '-'
let remarks = '-'

if (mark !== undefined && mark !== '-') {
if (mark >= 80) {
subjectGrade = 'A'; points = '12'; remarks = 'Excellent!'
} else if (mark >= 70) {
subjectGrade = 'B+'; points = '10'; remarks = 'Very good'
} else if (mark >= 60) {
subjectGrade = 'B'; points = '9'; remarks = 'Good'
} else if (mark >= 50) {
subjectGrade = 'C+'; points = '7'; remarks = 'Average'
} else if (mark >= 40) {
subjectGrade = 'C'; points = '6'; remarks = 'Below average'
} else if (mark >= 30) {
subjectGrade = 'D+'; points = '4'; remarks = 'Work hard'
} else if (mark >= 20) {
subjectGrade = 'D'; points = '3'; remarks = 'Need improvement'
} else {
subjectGrade = 'E'; points = '2'; remarks = 'Very poor'
}
}

tableData.push([subject.name, score.toString(), subjectGrade, points, remarks])
})

tableData.push(['', '', '', '', ''])
tableData.push(['TOTAL MARKS', totalMarks.toString(), '', '', ''])
tableData.push(['AVERAGE', averageMarks.toFixed(2), '', '', ''])
tableData.push(['OVERALL GRADE', '', overallGrade, '', ''])

autoTable(doc, {
head: [headers],
body: tableData,
startY: doc.lastAutoTable.finalY + 15,
styles: {
fontSize: 8,
cellPadding: 2
},
headStyles: {
fillColor: [41, 128, 185],
textColor: 255,
fontStyle: 'bold'
},
alternateRowStyles: {
fillColor: [245, 245, 245]
},
columnStyles: {
0: { cellWidth: 50 },
1: { cellWidth: 28, halign: 'center' },
2: { cellWidth: 20, halign: 'center' },
3: { cellWidth: 20, halign: 'center' },
4: { cellWidth: 45 }
},
margin: { top: 20, right: 5, bottom: 20, left: 20 }
})

const currentY = doc.lastAutoTable.finalY + 5
doc.setFontSize(9)
doc.setFont('helvetica', 'bold')
doc.text('Grade Legend:', 20, currentY)

doc.setFont('helvetica', 'normal')
doc.setFontSize(7)
doc.text('A: 80-100% (12 pts) | B+: 70-79% (10 pts) | B: 60-69% (9 pts) | C+: 50-59% (7 pts) | C: 40-49% (6 pts) | D+: 30-39% (4 pts) | D: 20-29% (3 pts) | E: Below 20% (2 pts)', 20, currentY + 6)

doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.text('Remarks:', 20, currentY + 16)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8)
let remarksText = ''
if (percentage >= 80) {
remarksText = 'Outstanding performance! Keep up the excellent work.'
} else if (percentage >= 70) {
remarksText = 'Very good performance. Continue working hard to maintain this standard.'
} else if (percentage >= 60) {
remarksText = 'Good performance. There is room for improvement in some subjects.'
} else if (percentage >= 50) {
remarksText = 'Average performance. Focus on weak areas to improve your grades.'
} else if (percentage >= 40) {
remarksText = 'Below average performance. Need to work harder to improve grades.'
} else {
remarksText = 'Poor performance. Immediate attention required. Consider seeking extra help.'
}
doc.text(remarksText, 20, currentY + 24)

const pageCount = doc.internal.getNumberOfPages()
for (let i = 1; i <= pageCount; i++) {
doc.setPage(i)
doc.setFontSize(7)
doc.setFont('helvetica', 'normal')
doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' })
doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, doc.internal.pageSize.height - 6, { align: 'center' })
doc.text(`This is an official academic report from ${school_info.school_name}`, 105, doc.internal.pageSize.height - 2, { align: 'center' })
}

const examName = exams.length > 0 ? exams[0].name.replace(/\s+/g, '_') : 'Results'
const schoolName = school_info.school_name.replace(/\s+/g, '_')
const fileName = `${schoolName}_${student.name.replace(/\s+/g, '_')}_${examName}_Report_${new Date().toISOString().split('T')[0]}.pdf`
doc.save(fileName)
}

export const downloadPDF = async (apiUrl) => {
try {
const response = await authFetch(apiUrl)
if (!response.ok) {
let errorMessage = `Failed to fetch data for PDF generation. Status: ${response.status}`
try {
const errorData = await response.json()
if (errorData.detail) {
errorMessage = errorData.detail
}
} catch (e) {}
if (response.status === 401) {
throw new Error('Authentication failed. Please log in again.')
}
throw new Error(errorMessage)
}
const data = await response.json()
await generateStudentResultPDF(data)
} catch (error) {
console.error('Error generating PDF:', error)
throw error
}
}
