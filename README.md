
# School Management System

An advanced, full-stack School Management System built with Node.js, Express, MongoDB, and React. Supports role-based access for Admin, Teacher, and Student users. Includes features for admissions, attendance, exams, fees, library, transport, notifications, and more.

---

## 🚀 Features

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

## 🛠️ Quick Start

### 1. Backend Setup

1. Copy `server/.env.example` to `server/.env` and fill in your values:
	```env
	PORT=5000
	MONGO_URI=mongodb://localhost:27017/school_management
	JWT_SECRET=your-secret
	JWT_EXPIRES_IN=7d
	BCRYPT_SALT_ROUNDS=12
	CORS_ORIGIN=http://localhost:5173
	```
2. Install dependencies and start the server:
	```bash
	cd server
	npm install
	npm run dev
	```

### 2. Frontend Setup

1. Copy `client/.env.example` to `client/.env` and set:
	```env
	VITE_API_URL=http://localhost:5000/api
	```
2. Install dependencies and start the client:
	```bash
	cd client
	npm install
	npm run dev
	```

---

## 🧑‍💻 Usage

1. Open [http://localhost:5173/](http://localhost:5173/) in your browser.
2. Register as a new user or log in with seeded credentials (if you ran the seed script).
3. Use the sidebar to access features: Students, Teachers, Classes, Attendance, Exams, Fees, Library, Transport, Health, Announcements, Notifications, Admissions, Timetable, and more.
4. Role-based UI: Admins see all features, teachers and students see only their relevant sections.

---

## 📦 Scripts

- `npm run dev` (backend) — Start server with nodemon
- `npm start` (backend) — Start server in production mode
- `npm run dev` (client) — Start React frontend

---

## 📚 API Endpoints (Sample)

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

## 🔒 Security & Best Practices

- **Never commit real secrets or .env files.** Use `.env.example` for templates.
- All sensitive files are excluded by `.gitignore`.
- Use strong secrets and unique credentials in production.
- Regularly update dependencies and audit for vulnerabilities.

---

## 📝 Notes

- Role-based access is enforced on all protected routes.
- Authentication uses secure HTTP-only cookies.
- All list endpoints support pagination (`page`, `limit`).
- For more details, see `SETUP_GUIDE.md` and `USER_GUIDE.md` (local only).

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.
