const classService = require("../services/class.service");
const { asyncHandler } = require("../utils/asyncHandler");

const createClass = asyncHandler(async (req, res) => {
  const classItem = await classService.createClass(req.body);
  res.status(201).json({ class: classItem });
});

const listClasses = asyncHandler(async (req, res) => {
  const result = await classService.listClasses(req.query);
  res.status(200).json(result);
});

const getClass = asyncHandler(async (req, res) => {
  const classItem = await classService.getClassById(req.params.id);
  res.status(200).json({ class: classItem });
});

const updateClass = asyncHandler(async (req, res) => {
  const classItem = await classService.updateClass(req.params.id, req.body);
  res.status(200).json({ class: classItem });
});

const deleteClass = asyncHandler(async (req, res) => {
  await classService.deleteClass(req.params.id);
  res.status(204).send();
});

module.exports = {
  createClass,
  listClasses,
  getClass,
  updateClass,
  deleteClass
};
