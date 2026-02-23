const express = require("express");
const Joi = require("joi");

const examController = require("../controllers/exam.controller");
const { validate } = require("../middleware/validate.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const router = express.Router();
const objectId = Joi.string().hex().length(24);

const resultSchema = Joi.object({
  student: objectId.required(),
  marks: Joi.number().min(0).required()
});

const createSchema = Joi.object({
  class: objectId.required(),
  subject: Joi.string().max(100).required(),
  examDate: Joi.date().required(),
  maxMarks: Joi.number().min(1).required(),
  results: Joi.array().items(resultSchema).optional()
});

const updateSchema = Joi.object({
  class: objectId,
  subject: Joi.string().max(100),
  examDate: Joi.date(),
  maxMarks: Joi.number().min(1),
  results: Joi.array().items(resultSchema)
});

const listSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  classId: objectId,
  subject: Joi.string().max(100)
});

router.use(authenticate);

router.post(
  "/",
  authorizeRoles("admin", "teacher"),
  validate({ body: createSchema }),
  examController.createExam
);

router.get(
  "/",
  validate({ query: listSchema }),
  examController.listExams
);

router.get(
  "/:id",
  validate({ params: Joi.object({ id: objectId.required() }) }),
  examController.getExam
);

router.patch(
  "/:id",
  authorizeRoles("admin", "teacher"),
  validate({ params: Joi.object({ id: objectId.required() }), body: updateSchema }),
  examController.updateExam
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validate({ params: Joi.object({ id: objectId.required() }) }),
  examController.deleteExam
);

module.exports = router;
