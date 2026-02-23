const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { postBook, getBooks, postIssue, postReturn, getIssues } = require("../controllers/library.controller");

const router = express.Router();

// Librarian/admin: add book
router.post("/books", authenticate, authorizeRoles("admin", "librarian"), postBook);

// Authenticated: view books
router.get("/books", authenticate, getBooks);

// Authenticated: issue book
router.post("/issue", authenticate, postIssue);

// Authenticated: return book
router.post("/return", authenticate, postReturn);

// Librarian/admin: view all issues
router.get("/issues", authenticate, authorizeRoles("admin", "librarian"), getIssues);

module.exports = router;
