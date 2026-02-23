const { createAdmission, listAdmissions, updateAdmissionStatus } = require("../models/Admission.model");
const { AppError } = require("../utils/appError");
const { ObjectId } = require("mongodb");

// POST /api/admissions
const postAdmission = async (req, res, next) => {
  try {
    const { name, email, details } = req.body;
    if (!name || !email) {
      throw new AppError("Name and email are required", 400);
    }
    // details: { phone, address, dob, parent info, etc. }
    const admission = await createAdmission({
      name,
      email,
      details: details || {},
    });
    res.status(201).json({ admission });
  } catch (err) {
    next(err);
  }
};

// GET /api/admissions
const getAdmissions = async (req, res, next) => {
  try {
    const admissions = await listAdmissions();
    res.json({ admissions });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admissions/:id/status
const patchAdmissionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) throw new AppError("Status is required", 400);
    await updateAdmissionStatus(new ObjectId(id), status);
    res.json({ message: "Admission status updated" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postAdmission,
  getAdmissions,
  patchAdmissionStatus,
};
