const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { postRoute, getRoutes, patchAssignStudent, patchAssignDriver } = require("../controllers/transport.controller");

const router = express.Router();

// Admin: add route
router.post("/routes", authenticate, authorizeRoles("admin"), postRoute);

// Authenticated: view routes
router.get("/routes", authenticate, getRoutes);

// Admin: assign student to route
router.patch("/routes/:id/assign-student", authenticate, authorizeRoles("admin"), patchAssignStudent);

// Admin: assign driver to route
router.patch("/routes/:id/assign-driver", authenticate, authorizeRoles("admin"), patchAssignDriver);

module.exports = router;
