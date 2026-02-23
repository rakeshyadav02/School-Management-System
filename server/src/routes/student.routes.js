const express = require("express");
const Joi = require("joi");

const studentController = require("../controllers/student.controller");
const { validate } = require("../middleware/validate.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const router = express.Router();
const objectId = Joi.string().hex().length(24);

const createSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  rollNumber: Joi.string().max(50).required(),
  class: objectId.required(),
  guardianName: Joi.string().max(100).optional(),
  guardianPhone: Joi.string().max(30).optional(),
  admissionDate: Joi.date().optional(),
  status: Joi.string().valid("active", "inactive").optional()
});

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  rollNumber: Joi.string().max(50),
  class: objectId,
  guardianName: Joi.string().max(100).allow(""),
  guardianPhone: Joi.string().max(30).allow(""),
  admissionDate: Joi.date(),
  status: Joi.string().valid("active", "inactive")
});

const listSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  search: Joi.string().max(100),
  classId: objectId,
  status: Joi.string().valid("active", "inactive")
});

router.use(authenticate);

router.post(
  "/",
  authorizeRoles("admin"),
  validate({ body: createSchema }),
  studentController.createStudent
);

router.get(
  "/",
  authorizeRoles("admin", "teacher"),
  validate({ query: listSchema }),
  studentController.listStudents
);

router.get(
  "/:id",
  authorizeRoles("admin", "teacher"),
  validate({ params: Joi.object({ id: objectId.required() }) }),
  studentController.getStudent
);

router.patch(
  "/:id",
  authorizeRoles("admin"),
  validate({ params: Joi.object({ id: objectId.required() }), body: updateSchema }),
  studentController.updateStudent
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validate({ params: Joi.object({ id: objectId.required() }) }),
  studentController.deleteStudent
);

module.exports = router;
