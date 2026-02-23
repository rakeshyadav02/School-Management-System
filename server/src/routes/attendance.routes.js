const express = require("express");
const Joi = require("joi");

const attendanceController = require("../controllers/attendance.controller");
const { validate } = require("../middleware/validate.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const router = express.Router();
const objectId = Joi.string().hex().length(24);

const createSchema = Joi.object({
  student: objectId.required(),
  class: objectId.required(),
  date: Joi.date().required(),
  status: Joi.string().valid("present", "absent", "late", "excused").optional(),
  takenBy: objectId.optional()
});

const updateSchema = Joi.object({
  status: Joi.string().valid("present", "absent", "late", "excused"),
  takenBy: objectId
});

const listSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  classId: objectId,
  studentId: objectId,
  status: Joi.string().valid("present", "absent", "late", "excused"),
  date: Joi.date()
});

const bulkMarkSchema = Joi.object({
  classId: objectId.required(),
  date: Joi.date().required(),
  status: Joi.string().valid("present", "absent", "late", "excused").required()
});

router.use(authenticate);

router.post(
  "/",
  authorizeRoles("admin", "teacher"),
  validate({ body: createSchema }),
  attendanceController.createAttendance
);

router.get(
  "/",
  authorizeRoles("admin", "teacher"),
  validate({ query: listSchema }),
  attendanceController.listAttendance
);

router.get(
  "/:id",
  authorizeRoles("admin", "teacher"),
  validate({ params: Joi.object({ id: objectId.required() }) }),
  attendanceController.getAttendance
);

router.patch(
  "/:id",
  authorizeRoles("admin", "teacher"),
  validate({ params: Joi.object({ id: objectId.required() }), body: updateSchema }),
  attendanceController.updateAttendance
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validate({ params: Joi.object({ id: objectId.required() }) }),
  attendanceController.deleteAttendance
);

router.post(
  "/bulk-mark",
  authorizeRoles("admin", "teacher"),
  validate({ body: bulkMarkSchema }),
  attendanceController.bulkMarkAttendance
);

module.exports = router;
