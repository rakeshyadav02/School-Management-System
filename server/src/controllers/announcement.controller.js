const { createAnnouncement, listAnnouncements } = require("../models/Announcement.model");
const { AppError } = require("../utils/appError");

// POST /api/announcements
const postAnnouncement = async (req, res, next) => {
  try {
    const { title, message, audience } = req.body;
    if (!title || !message) {
      throw new AppError("Title and message are required", 400);
    }
    // audience: 'all', 'students', 'teachers', 'parents', etc.
    const announcement = await createAnnouncement({
      title,
      message,
      audience: audience || "all",
      createdBy: req.user ? req.user._id : null,
    });
    res.status(201).json({ announcement });
  } catch (err) {
    next(err);
  }
};

// GET /api/announcements
const getAnnouncements = async (req, res, next) => {
  try {
    // Optionally filter by audience
    const { audience } = req.query;
    const filter = audience ? { audience } : {};
    const announcements = await listAnnouncements(filter);
    res.json({ announcements });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postAnnouncement,
  getAnnouncements,
};
