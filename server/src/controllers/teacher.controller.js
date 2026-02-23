const teacherService = require("../services/teacher.service");
const { asyncHandler } = require("../utils/asyncHandler");

const createTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.createTeacher(req.body);
  res.status(201).json({ teacher });
});

const listTeachers = asyncHandler(async (req, res) => {
  const result = await teacherService.listTeachers(req.query);
  res.status(200).json(result);
});

const getTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.getTeacherById(req.params.id);
  res.status(200).json({ teacher });
});

const updateTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.updateTeacher(req.params.id, req.body);
  res.status(200).json({ teacher });
});

const deleteTeacher = asyncHandler(async (req, res) => {
  await teacherService.deleteTeacher(req.params.id);
  res.status(204).send();
});

module.exports = {
  createTeacher,
  listTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher
};
