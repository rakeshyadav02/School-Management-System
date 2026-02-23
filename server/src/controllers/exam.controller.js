const examService = require("../services/exam.service");
const { asyncHandler } = require("../utils/asyncHandler");

const createExam = asyncHandler(async (req, res) => {
  const exam = await examService.createExam(req.body);
  res.status(201).json({ exam });
});

const listExams = asyncHandler(async (req, res) => {
  const result = await examService.listExams(req.query);
  res.status(200).json(result);
});

const getExam = asyncHandler(async (req, res) => {
  const exam = await examService.getExamById(req.params.id);
  res.status(200).json({ exam });
});

const updateExam = asyncHandler(async (req, res) => {
  const exam = await examService.updateExam(req.params.id, req.body);
  res.status(200).json({ exam });
});

const deleteExam = asyncHandler(async (req, res) => {
  await examService.deleteExam(req.params.id);
  res.status(204).send();
});

module.exports = {
  createExam,
  listExams,
  getExam,
  updateExam,
  deleteExam
};
