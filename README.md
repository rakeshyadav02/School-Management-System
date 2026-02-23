# School Management System

Production-ready backend foundation for a School Management System using Node.js, Express, and MongoDB.

## Backend setup

1. Create a `server/.env` file (copy from `server/.env.example`):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/school_management
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=http://localhost:5173
```

2. Install dependencies and start the server:

```
cd server
npm install
npm run dev
```

## Frontend setup

1. Create a `client/.env` file (copy from `client/.env.example`):

```
VITE_API_URL=http://localhost:5000/api
```

2. Install dependencies and start the client:

```
cd client
npm install
npm run dev
```

## Scripts

- `npm run dev` - start with nodemon
- `npm start` - start in production mode

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/students`
- `GET /api/teachers`
- `GET /api/classes`
- `GET /api/attendance`
- `GET /api/exams`
- `GET /api/fees`

## Notes

- Role-based access is enforced on protected routes using JWT.
- Authentication uses a secure HTTP-only cookie named `token`.
- List endpoints support `page` and `limit` query parameters.
