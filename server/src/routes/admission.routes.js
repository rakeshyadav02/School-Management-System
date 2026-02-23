const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { postAdmission, getAdmissions, patchAdmissionStatus } = require("../controllers/admission.controller");

const router = express.Router();

// Public: submit admission form
router.post("/", postAdmission);

// Admin/principal: view all admissions
router.get("/", authenticate, authorizeRoles("admin", "principal"), getAdmissions);

// Admin/principal: update admission status
router.patch("/:id/status", authenticate, authorizeRoles("admin", "principal"), patchAdmissionStatus);

module.exports = router;
