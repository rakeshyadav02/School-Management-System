const express = require("express");
const Joi = require("joi");

const classController = require("../controllers/class.controller");
const { validate } = require("../middleware/validate.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const router = express.Router();
const objectId = Joi.string().hex().length(24);

const createSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  section: Joi.string().max(20).optional(),
  year: Joi.number().integer().min(2000).required(),
  classTeacher: objectId.optional(),
  capacity: Joi.number().integer().min(1).max(200).optional()
});

const updateSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  section: Joi.string().max(20).allow(""),
  year: Joi.number().integer().min(2000),
  classTeacher: objectId.allow(null),
  capacity: Joi.number().integer().min(1).max(200)
});

const listSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  search: Joi.string().max(100),
  year: Joi.number().integer().min(2000)
});

router.use(authenticate);

router.post(
  "/",
  authorizeRoles("admin"),
  validate({ body: createSchema }),
  classController.createClass
);

router.get(
  "/",
  authorizeRoles("admin", "teacher"),
  validate({ query: listSchema }),
  classController.listClasses
);

router.get(
  "/:id",
  authorizeRoles("admin", "teacher"),
  validate({ params: Joi.object({ id: objectId.required() }) }),
  classController.getClass
);

router.patch(
  "/:id",
  authorizeRoles("admin"),
  validate({ params: Joi.object({ id: objectId.required() }), body: updateSchema }),
  classController.updateClass
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validate({ params: Joi.object({ id: objectId.required() }) }),
  classController.deleteClass
);

module.exports = router;
