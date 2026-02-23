const studentService = require("../services/student.service");
const { asyncHandler } = require("../utils/asyncHandler");

const createStudent = asyncHandler(async (req, res) => {
  const student = await studentService.createStudent(req.body);
  res.status(201).json({ student });
});

const listStudents = asyncHandler(async (req, res) => {
  const result = await studentService.listStudents(req.query);
  res.status(200).json(result);
});

const getStudent = asyncHandler(async (req, res) => {
  const student = await studentService.getStudentById(req.params.id);
  res.status(200).json({ student });
});

const updateStudent = asyncHandler(async (req, res) => {
  const student = await studentService.updateStudent(req.params.id, req.body);
  res.status(200).json({ student });
});

const deleteStudent = asyncHandler(async (req, res) => {
  await studentService.deleteStudent(req.params.id);
  res.status(204).send();
});

module.exports = {
  createStudent,
  listStudents,
  getStudent,
  updateStudent,
  deleteStudent
};
