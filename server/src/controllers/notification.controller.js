const { createNotification, listNotifications, markAsRead } = require("../models/Notification.model");
const { AppError } = require("../utils/appError");
const { ObjectId } = require("mongodb");

// POST /api/notifications
const postNotification = async (req, res, next) => {
  try {
    const { userId, message, type } = req.body;
    if (!userId || !message) {
      throw new AppError("userId and message are required", 400);
    }
    const notification = await createNotification({
      userId: new ObjectId(userId),
      message,
      type: type || "info",
      createdBy: req.user ? req.user._id : null,
    });
    res.status(201).json({ notification });
  } catch (err) {
    next(err);
  }
};

// GET /api/notifications
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await listNotifications(req.user._id);
    res.json({ notifications });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notifications/:id/read
const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await markAsRead(new ObjectId(id));
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postNotification,
  getNotifications,
  markNotificationRead,
};
