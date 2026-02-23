const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { postTimetable, getTimetables, patchTimetable } = require("../controllers/timetable.controller");

const router = express.Router();

// Admin/teacher: create timetable
router.post("/", authenticate, authorizeRoles("admin", "teacher"), postTimetable);

// Authenticated: view timetables
router.get("/", authenticate, getTimetables);

// Admin/teacher: update timetable
router.patch("/:id", authenticate, authorizeRoles("admin", "teacher"), patchTimetable);

module.exports = router;
