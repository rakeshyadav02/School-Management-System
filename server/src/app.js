const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const { env } = require("./config/env");
const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const teacherRoutes = require("./routes/teacher.routes");
const classRoutes = require("./routes/class.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const examRoutes = require("./routes/exam.routes");
const feeRoutes = require("./routes/fee.routes");
const feeEnhancedRoutes = require("./routes/feeEnhanced.routes");
const userRoutes = require("./routes/user.routes");
const announcementRoutes = require("./routes/announcement.routes");
const notificationRoutes = require("./routes/notification.routes");
const admissionRoutes = require("./routes/admission.routes");
const admissionDocRoutes = require("./routes/admissionDoc.routes");
const timetableRoutes = require("./routes/timetable.routes");
const libraryRoutes = require("./routes/library.routes");
const transportRoutes = require("./routes/transport.routes");
const healthDisciplineRoutes = require("./routes/healthDiscipline.routes");
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again later."
  }
});

const allowedOrigins = env.corsOrigins;

const corsOriginMatcher = (origin, callback) => {
  if (!origin) {
    return callback(null, true);
  }

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error("Origin not allowed by CORS"));
};

app.use(helmet());
app.use(
  cors({
    origin: corsOriginMatcher,
    credentials: true
  })
);
app.use("/api", apiLimiter);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(morgan("combined"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/fees", feeEnhancedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admissions", admissionDocRoutes);
app.use("/api/timetables", timetableRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/health-discipline", healthDisciplineRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
