const express = require("express");
const Joi = require("joi");

const authController = require("../controllers/auth.controller");
const { validate } = require("../middleware/validate.middleware");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Full name is required.",
    "string.min": "Full name must be at least 2 characters.",
    "string.max": "Full name must be at most 100 characters.",
    "any.required": "Full name is required."
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required."
  }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(strongPasswordPattern)
    .messages({
      "string.min": "Password must be at least 8 characters.",
      "string.max": "Password must be at most 128 characters.",
      "string.pattern.base": "Password must include uppercase, lowercase, number, and special character.",
      "string.empty": "Password is required.",
      "any.required": "Password is required."
    })
    .required(),
  role: Joi.string().valid("student", "teacher", "admin").default("student")
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required."
  }),
  password: Joi.string().min(8).max(128).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters.",
    "string.max": "Password must be at most 128 characters.",
    "any.required": "Password is required."
  })
});

router.post("/register", validate({ body: registerSchema }), authController.register);
router.post("/login", validate({ body: loginSchema }), authController.login);
router.get("/me", authenticate, authController.me);
router.post("/logout", authenticate, authController.logout);

module.exports = router;
