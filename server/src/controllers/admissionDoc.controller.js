const { saveDocument, listDocuments } = require("../models/AdmissionDoc.model");
const { AppError } = require("../utils/appError");
const path = require("path");
const fs = require("fs");

// POST /api/admissions/:id/documents
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError("No file uploaded", 400);
    const { id } = req.params;
    const doc = await saveDocument({
      admissionId: id,
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });
    res.status(201).json({ document: doc });
  } catch (err) {
    next(err);
  }
};

// GET /api/admissions/:id/documents
const getDocuments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const docs = await listDocuments(id);
    res.json({ documents: docs });
  } catch (err) {
    next(err);
  }
};

// GET /api/admissions/documents/:filename
const downloadDocument = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../../uploads/admissions", filename);
    if (!fs.existsSync(filePath)) throw new AppError("File not found", 404);
    res.download(filePath);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  downloadDocument,
};
