const express = require("express");
const multer = require("multer");
const path = require("path");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { uploadDocument, getDocuments, downloadDocument } = require("../controllers/admissionDoc.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/admissions"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Upload document for admission (public)
router.post("/:id/documents", upload.single("file"), uploadDocument);

// List documents for admission (admin/principal)
router.get("/:id/documents", authenticate, authorizeRoles("admin", "principal"), getDocuments);

// Download document (admin/principal)
router.get("/documents/:filename", authenticate, authorizeRoles("admin", "principal"), downloadDocument);

module.exports = router;
