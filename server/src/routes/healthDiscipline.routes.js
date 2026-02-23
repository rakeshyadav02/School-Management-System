const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { postHealth, getHealth, postDiscipline, getDiscipline } = require("../controllers/healthDiscipline.controller");

const router = express.Router();

// Staff: add health record
router.post("/health", authenticate, authorizeRoles("admin", "teacher", "principal"), postHealth);
// Staff: view health records
router.get("/health/:studentId", authenticate, authorizeRoles("admin", "teacher", "principal"), getHealth);

// Staff: add discipline record
router.post("/discipline", authenticate, authorizeRoles("admin", "teacher", "principal"), postDiscipline);
// Staff: view discipline records
router.get("/discipline/:studentId", authenticate, authorizeRoles("admin", "teacher", "principal"), getDiscipline);

module.exports = router;
