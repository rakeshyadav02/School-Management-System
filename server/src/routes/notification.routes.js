const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { postNotification, getNotifications, markNotificationRead } = require("../controllers/notification.controller");

const router = express.Router();

// Only admin, principal, teacher can send notifications
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "principal", "teacher"),
  postNotification
);

// Authenticated user can get their notifications
router.get("/", authenticate, getNotifications);

// Mark notification as read
router.patch("/:id/read", authenticate, markNotificationRead);

module.exports = router;
