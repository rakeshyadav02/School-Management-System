const { createTimetable, listTimetables, updateTimetable } = require("../models/Timetable.model");
const { AppError } = require("../utils/appError");
const { ObjectId } = require("mongodb");

// POST /api/timetables
const postTimetable = async (req, res, next) => {
  try {
    const { className, section, periods } = req.body;
    if (!className || !section || !Array.isArray(periods)) {
      throw new AppError("className, section, and periods are required", 400);
    }
    const timetable = await createTimetable({
      className,
      section,
      periods, // [{ day, period, subject, teacher }]
    });
    res.status(201).json({ timetable });
  } catch (err) {
    next(err);
  }
};

// GET /api/timetables
const getTimetables = async (req, res, next) => {
  try {
    const { className, section } = req.query;
    const filter = {};
    if (className) filter.className = className;
    if (section) filter.section = section;
    const timetables = await listTimetables(filter);
    res.json({ timetables });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/timetables/:id
const patchTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;
    await updateTimetable(new ObjectId(id), update);
    res.json({ message: "Timetable updated" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postTimetable,
  getTimetables,
  patchTimetable,
};
