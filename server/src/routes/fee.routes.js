const express = require("express");
const Joi = require("joi");

const feeController = require("../controllers/fee.controller");
const { validate } = require("../middleware/validate.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const router = express.Router();
const objectId = Joi.string().hex().length(24);

const createSchema = Joi.object({
  student: objectId.required(),
  amount: Joi.number().min(0).required(),
  status: Joi.string().valid("pending", "paid", "overdue").optional(),
  dueDate: Joi.date().required(),
  paidAt: Joi.date().optional(),
  reference: Joi.string().max(100).optional()
});

const updateSchema = Joi.object({
  amount: Joi.number().min(0),
  status: Joi.string().valid("pending", "paid", "overdue"),
  dueDate: Joi.date(),
  paidAt: Joi.date().allow(null),
  reference: Joi.string().max(100).allow("")
});

const listSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  studentId: objectId,
  status: Joi.string().valid("pending", "paid", "overdue"),
  dueBefore: Joi.date()
});

router.use(authenticate);

router.post(
  "/",
  authorizeRoles("admin"),
  validate({ body: createSchema }),
  feeController.createFee
);

router.get(
  "/",
  authorizeRoles("admin"),
  validate({ query: listSchema }),
  feeController.listFees
);

router.get(
  "/:id",
  authorizeRoles("admin"),
  validate({ params: Joi.object({ id: objectId.required() }) }),
  feeController.getFee
);

router.patch(
  "/:id",
  authorizeRoles("admin"),
  validate({ params: Joi.object({ id: objectId.required() }), body: updateSchema }),
  feeController.updateFee
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validate({ params: Joi.object({ id: objectId.required() }) }),
  feeController.deleteFee
);

module.exports = router;
