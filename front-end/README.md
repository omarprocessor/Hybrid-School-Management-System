# 📘 Hybrid School Management System – Frontend

This is the **React.js frontend** for the Hybrid School Management System. It provides public pages and secure dashboards for students, teachers, and administrators.

---

## ✨ Features

- Public pages: Home, About Us, Contact, Blog/Posts
- Role-based dashboards for students, teachers, and admins
- Student: View grades, attendance, profile, announcements
- Teacher: Manage marks, attendance, assigned classes/subjects, CSV upload for marks
- Admin: Manage students, teachers, classes, subjects, exams, marks, attendance, user approvals, blog
- JWT authentication (login, logout, token refresh)
- Responsive design (optimized for desktop, basic mobile support)
- File upload for profile pictures and blog images

---

## 🧰 Tech Stack

- React JS
- CSS
- Axios (for API requests)
- React Router DOM (for routing)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
cd front-end
npm install
```

### 2. Configure API Base URL

Create a `.env` file in the `front-end` directory with:

```
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

Adjust the URL if your backend runs elsewhere.

### 3. Run the development server

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🔗 Backend Connection

- The frontend communicates with the Django backend via REST API endpoints (see main project README for details).
- JWT tokens are stored in localStorage and attached to API requests.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details. 