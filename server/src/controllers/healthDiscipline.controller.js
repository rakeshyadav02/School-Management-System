const { addHealthRecord, listHealthRecords, addDisciplineRecord, listDisciplineRecords } = require("../models/HealthDiscipline.model");
const { AppError } = require("../utils/appError");

// POST /api/health-discipline/health
const postHealth = async (req, res, next) => {
  try {
    const { studentId, details } = req.body;
    if (!studentId || !details) throw new AppError("studentId and details required", 400);
    const record = await addHealthRecord({ studentId, details });
    res.status(201).json({ record });
  } catch (err) {
    next(err);
  }
};

// GET /api/health-discipline/health/:studentId
const getHealth = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const records = await listHealthRecords(studentId);
    res.json({ records });
  } catch (err) {
    next(err);
  }
};

// POST /api/health-discipline/discipline
const postDiscipline = async (req, res, next) => {
  try {
    const { studentId, incident } = req.body;
    if (!studentId || !incident) throw new AppError("studentId and incident required", 400);
    const record = await addDisciplineRecord({ studentId, incident });
    res.status(201).json({ record });
  } catch (err) {
    next(err);
  }
};

// GET /api/health-discipline/discipline/:studentId
const getDiscipline = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const records = await listDisciplineRecords(studentId);
    res.json({ records });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postHealth,
  getHealth,
  postDiscipline,
  getDiscipline,
};
