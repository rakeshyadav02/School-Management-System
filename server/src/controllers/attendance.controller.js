const attendanceService = require("../services/attendance.service");
const { asyncHandler } = require("../utils/asyncHandler");

const createAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.createAttendance({
    ...req.body,
    takenBy: req.body.takenBy || req.user.id
  });
  res.status(201).json({ attendance });
});

const listAttendance = asyncHandler(async (req, res) => {
  const result = await attendanceService.listAttendance(req.query);
  res.status(200).json(result);
});

const getAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.getAttendanceById(req.params.id);
  res.status(200).json({ attendance });
});

const updateAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.updateAttendance(req.params.id, req.body);
  res.status(200).json({ attendance });
});

const deleteAttendance = asyncHandler(async (req, res) => {
  await attendanceService.deleteAttendance(req.params.id);
  res.status(204).send();
});

const bulkMarkAttendance = asyncHandler(async (req, res) => {
  const { classId, date, status } = req.body;
  const result = await attendanceService.bulkMarkAttendance({
    classId,
    date,
    status,
    takenBy: req.user.id
  });
  res.status(201).json(result);
});

module.exports = {
  createAttendance,
  listAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  bulkMarkAttendance
};
