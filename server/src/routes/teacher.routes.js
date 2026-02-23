const express = require("express");
const Joi = require("joi");

const teacherController = require("../controllers/teacher.controller");
const { validate } = require("../middleware/validate.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const router = express.Router();
const objectId = Joi.string().hex().length(24);

const createSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  employeeId: Joi.string().max(50).required(),
  department: Joi.string().max(100).optional(),
  subjects: Joi.array().items(Joi.string().max(100)).optional(),
  phone: Joi.string().max(30).optional(),
  status: Joi.string().valid("active", "inactive").optional()
});

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  employeeId: Joi.string().max(50),
  department: Joi.string().max(100).allow(""),
  subjects: Joi.array().items(Joi.string().max(100)),
  phone: Joi.string().max(30).allow(""),
  status: Joi.string().valid("active", "inactive")
});

const listSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  search: Joi.string().max(100),
  status: Joi.string().valid("active", "inactive")
});

router.use(authenticate);

router.post(
  "/",
  authorizeRoles("admin"),
  validate({ body: createSchema }),
  teacherController.createTeacher
);

router.get(
  "/",
  authorizeRoles("admin"),
  validate({ query: listSchema }),
  teacherController.listTeachers
);

router.get(
  "/:id",
  authorizeRoles("admin"),
  validate({ params: Joi.object({ id: objectId.required() }) }),
  teacherController.getTeacher
);

router.patch(
  "/:id",
  authorizeRoles("admin"),
  validate({ params: Joi.object({ id: objectId.required() }), body: updateSchema }),
  teacherController.updateTeacher
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validate({ params: Joi.object({ id: objectId.required() }) }),
  teacherController.deleteTeacher
);

module.exports = router;
