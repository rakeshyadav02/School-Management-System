const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { postFeeStructure, getFeeStructures, postPayment, getPayments } = require("../controllers/feeEnhanced.controller");

const router = express.Router();

// Admin/accountant: create fee structure
router.post("/structures", authenticate, authorizeRoles("admin", "accountant"), postFeeStructure);

// Authenticated: view fee structures
router.get("/structures", authenticate, getFeeStructures);

// Authenticated: record payment
router.post("/payments", authenticate, postPayment);

// Admin/accountant: view all payments
router.get("/payments", authenticate, authorizeRoles("admin", "accountant"), getPayments);

module.exports = router;
