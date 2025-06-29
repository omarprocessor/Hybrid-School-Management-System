# 🏫 Hybrid School Management System

A full-featured school management platform with both **public-facing pages** and a **secure internal dashboard** for students, teachers, staff, and administrators. It features **fingerprint-based attendance logging** with real-time **SMS notifications** and a smooth user experience across web and mobile devices.

---

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Biometric Integration](#biometric-integration)
- [SMS Notifications](#sms-notifications)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## ✨ Features

- Public pages: Home, About Us, Contact, Blog/Posts
- Role-based authentication and dashboards:
  - Student
  - Teacher
  - Staff
  - Admin
- **Fingerprint attendance system** (hardware-based)
- Real-time **SMS alerts** to parents when a student arrives
- SMS notifications when results are uploaded
- Student grades, attendance logs, announcements
- Responsive design for both desktop and mobile

---

## 🧰 Tech Stack

**Frontend:**
- React JS
- Tailwind CSS
- Axios

**Backend:**
- Django Rest Framework (DRF)
- PostgreSQL
- JWT Authentication (SimpleJWT)

**Hardware & Integration:**
- ZKTeco / UART-based fingerprint module
- Serial communication or SDK integration

**Third-party Services:**
- Africastalking / Twilio (for SMS)
- Cloudinary (media storage)
- Render / Railway (deployment)
- Google OAuth (authentication)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/omarprocessor/Hybrid-School-Management-System.git
cd hybrid-school-system
