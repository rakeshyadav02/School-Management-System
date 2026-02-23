const { addRoute, listRoutes, assignStudent, assignDriver } = require("../models/Transport.model");
const { AppError } = require("../utils/appError");
const { ObjectId } = require("mongodb");

// POST /api/transport/routes
const postRoute = async (req, res, next) => {
  try {
    const { name, stops } = req.body;
    if (!name || !Array.isArray(stops)) throw new AppError("Route name and stops required", 400);
    const route = await addRoute({ name, stops });
    res.status(201).json({ route });
  } catch (err) {
    next(err);
  }
};

// GET /api/transport/routes
const getRoutes = async (req, res, next) => {
  try {
    const routes = await listRoutes();
    res.json({ routes });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/transport/routes/:id/assign-student
const patchAssignStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;
    if (!studentId) throw new AppError("studentId required", 400);
    await assignStudent(new ObjectId(id), new ObjectId(studentId));
    res.json({ message: "Student assigned to route" });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/transport/routes/:id/assign-driver
const patchAssignDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { driverId } = req.body;
    if (!driverId) throw new AppError("driverId required", 400);
    await assignDriver(new ObjectId(id), new ObjectId(driverId));
    res.json({ message: "Driver assigned to route" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postRoute,
  getRoutes,
  patchAssignStudent,
  patchAssignDriver,
};
