# 🏫 Hybrid School Management System

A full-featured school management platform with both **public-facing pages** and a **secure internal dashboard** for students, teachers, and administrators. It features **fingerprint-based attendance logging** with real-time **SMS notifications** (via Africastalking) and a smooth user experience, especially on desktop devices.

---

## ✨ Features

- **Public Pages:**
  - Home
  - About Us
  - Contact
  - Blog/Posts (with individual post view)
- **Role-Based Authentication & Dashboards:**
  - Student: View grades, attendance, profile, announcements
  - Teacher: Manage marks, attendance, assigned classes/subjects, CSV upload for marks
  - Admin: Manage students, teachers, classes, subjects, exams, marks, attendance, user approvals, blog
- **Fingerprint Attendance System:**
  - Hardware-based attendance logging (UART fingerprint module)
  - Real-time SMS alerts to parents when a student arrives (Africastalking)
- **SMS Notifications:**
  - Alerts for attendance and when results are uploaded (Africastalking only)
- **Student Management:**
  - Registration, approval workflow, profile management
- **Class & Subject Management:**
  - CRUD for classes, subjects, assignments
- **Exam & Marks Management:**
  - Exam creation, CSV upload/download for marks, result notifications
- **Attendance Management:**
  - Mark/check attendance, view logs, class teacher features
- **Blog System:**
  - Admin can post news/announcements, public can view
- **Responsive Design:**
  - Optimized for desktop; basic mobile support
- **Secure JWT Authentication:**
  - Access/refresh tokens, role-based access
- **Local Media Storage:**
  - Profile pictures, blog images stored locally (not in the cloud)
- **CORS Support:**
  - For React frontend integration

---

## 🧰 Tech Stack

**Frontend:**
- React JS
- CSS
- Axios

**Backend:**
- Django Rest Framework (DRF)
- PostgreSQL
- JWT Authentication (SimpleJWT)

**Hardware & Integration:**
- UART-based fingerprint module
- Serial communication

**Third-party Services:**
- Africastalking (for SMS)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/omarprocessor/Hybrid-School-Management-System.git
cd hybrid-school-system
```

---

## 📚 API Endpoints

All endpoints are prefixed with `/api/` (if using the default Django setup). Authentication is required for most endpoints (JWT access token in `Authorization: Bearer <token>` header).

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/token/` | POST | Obtain JWT access and refresh tokens (login) |
| `/token/refresh/` | POST | Refresh JWT access token |
| `/register/` | POST | Register a new user |
| `/me/` | GET | Get current user profile |
| `/users/` | GET | List all users (admin only) |
| `/user-approvals/` | GET, PATCH | List or update user approval status (admin) |
| `/user-approvals/<int:pk>/` | GET, PATCH | Retrieve/update a specific user approval |
| `/classrooms/` | GET, POST | List or create classrooms |
| `/classrooms/<int:id>/` | GET, PUT, DELETE | Retrieve, update, or delete a classroom |
| `/subjects/` | GET, POST | List or create subjects |
| `/subjects/<int:pk>/` | GET, PUT, DELETE | Retrieve, update, or delete a subject |
| `/students/` | GET, POST | List or create students |
| `/students/<int:pk>/` | GET, PUT, DELETE | Retrieve, update, or delete a student |
| `/teachers/` | GET, POST | List or create teachers |
| `/teachers/<int:pk>/` | GET, PUT, DELETE | Retrieve, update, or delete a teacher |
| `/assignments/` | GET, POST | List or create teacher-class-subject assignments |
| `/assignments/<int:pk>/` | GET, PUT, DELETE | Retrieve, update, or delete an assignment |
| `/exams/` | GET, POST | List or create exams |
| `/exams/<int:pk>/` | GET, PUT, DELETE | Retrieve, update, or delete an exam |
| `/marks/` | GET, POST | List or create marks |
| `/marks/<int:pk>/` | GET, PUT, DELETE | Retrieve, update, or delete a mark |
| `/marks/template/` | GET | Download CSV template for marks upload |
| `/marks/upload/` | POST | Upload marks via CSV |
| `/attendance/` | POST | Mark attendance (fingerprint or manual) |
| `/attendance/list/` | GET | List all attendance records |
| `/attendance/<int:pk>/` | GET, PUT, DELETE | Retrieve, update, or delete an attendance record |
| `/my-student/` | GET | Get current student's profile |
| `/my-marks/` | GET | Get current student's marks |
| `/my-attendance/` | GET | Get current student's attendance |
| `/my-class-attendance/` | GET | Get class attendance for class teacher |
| `/blog/` | GET, POST | List or create blog posts |
| `/blog/<slug:slug>/` | GET, PUT, DELETE | Retrieve, update, or delete a blog post |

**Note:** Some endpoints may require admin or specific role permissions. See the code for detailed permission logic.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
