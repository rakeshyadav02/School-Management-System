const express = require("express");
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");
const Joi = require("joi");

const router = express.Router();

// Validation schemas

const createUserSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
  role: Joi.string().valid(
    "superadmin",
    "admin",
    "principal",
    "teacher",
    "student",
    "parent",
    "accountant",
    "librarian"
  ).required()
});


const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  role: Joi.string().valid(
    "superadmin",
    "admin",
    "principal",
    "teacher",
    "student",
    "parent",
    "accountant",
    "librarian"
  ),
  isActive: Joi.boolean(),
  password: Joi.string().min(8)
});

const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().required().min(8)
});

// Routes - All require authentication and admin role
router.use(authenticate, authorizeRoles("admin"));

// List all users
router.get("/", userController.listUsers);

// Get single user
router.get("/:id", userController.getUserById);

// Create user
router.post("/", validate(createUserSchema), userController.createUser);

// Update user
router.put("/:id", validate(updateUserSchema), userController.updateUser);

// Delete user
router.delete("/:id", userController.deleteUser);

// Reset user password
router.post("/:id/reset-password", validate(resetPasswordSchema), userController.resetPassword);

module.exports = router;
