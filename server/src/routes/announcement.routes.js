const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { postAnnouncement, getAnnouncements } = require("../controllers/announcement.controller");

const router = express.Router();

// Only admin, principal, or teacher can post announcements
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "principal", "teacher"),
  postAnnouncement
);

// Anyone authenticated can view announcements
router.get("/", authenticate, getAnnouncements);

module.exports = router;
