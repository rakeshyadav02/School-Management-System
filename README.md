
# School Management System

A full-stack school administration platform built with React, Node.js, Express, and MongoDB. The system provides role-based workflows for administrators, teachers, and students across core academic and operational functions.

---

## Features

- User authentication (JWT, HTTP-only cookies)
- Role-based access (admin, teacher, student)
- Student, teacher, and class management (CRUD)
- Attendance tracking
- Exam management
- Fee management
- Library management
- Transport management
- Health & discipline records
- Announcements & notifications
- Admissions & document upload
- Timetable management
- Responsive React frontend
- Toast notifications & error handling

---

## Quick Start

### Prerequisites

- Node.js 16 or later
- MongoDB running locally or a MongoDB Atlas connection
- Two available local ports: `5174` for the frontend and `5001` for the API

This project uses separate local ports so it can run alongside another application:

- Frontend: `http://localhost:5174`
- Backend API: `http://localhost:5001`

### 1. Backend Setup

1. Create `server/.env` and provide local values. Do not use production credentials for local development:
	```env
	PORT=5001
	MONGO_URI=mongodb://localhost:27017/school_management
	JWT_SECRET=replace-with-a-long-random-secret
	JWT_EXPIRES_IN=7d
	NODE_ENV=development
	BCRYPT_SALT_ROUNDS=12
	CORS_ORIGIN=http://localhost:5174
	```
2. Install dependencies and start the server:
	```bash
	cd server
	npm install
	npm run dev
	```

To load sample users and records for local development, run this once from the `server` directory:

	```bash
	npm run seed
	```

### 2. Frontend Setup

1. Create `client/.env` and set:
	```env
	VITE_API_URL=http://localhost:5001/api
	```
2. Install dependencies and start the client:
	```bash
	cd client
	npm install
	npm run dev
	```

---

## Usage

1. Open [http://localhost:5174/](http://localhost:5174/) in your browser.
2. Register as a new user or log in with the local credentials created by the seed script.
3. Use the sidebar to access features: Students, Teachers, Classes, Attendance, Exams, Fees, Library, Transport, Health, Announcements, Notifications, Admissions, Timetable, and more.
4. Role-based UI: Admins see all features, teachers and students see only their relevant sections.

---

## Scripts

- `npm run dev` (backend) — Start server with nodemon
- `npm start` (backend) — Start server in production mode
- `npm run dev` (client) — Start React frontend

---

## API Endpoints (Sample)

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user
- `POST /api/auth/logout` — Logout
- `GET /api/students` — List students
- `GET /api/teachers` — List teachers
- `GET /api/classes` — List classes
- `GET /api/attendance` — List attendance
- `GET /api/exams` — List exams
- `GET /api/fees` — List fees

---

## Security

- **Never commit real secrets or `.env` files.** Configure environment variables locally.
- All sensitive files are excluded by `.gitignore`.
- Use strong secrets and unique credentials in production.
- Regularly update dependencies and audit for vulnerabilities.
- Treat seeded accounts and data as development-only.

---

## Notes

- Role-based access is enforced on all protected routes.
- Authentication uses secure HTTP-only cookies.
- All list endpoints support pagination (`page`, `limit`).
- For more details, see `SETUP_GUIDE.md`.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

