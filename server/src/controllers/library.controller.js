const { addBook, listBooks, issueBook, returnBook, listIssues } = require("../models/Library.model");
const { AppError } = require("../utils/appError");
const { ObjectId } = require("mongodb");

// POST /api/library/books
const postBook = async (req, res, next) => {
  try {
    const { title, author, isbn } = req.body;
    if (!title || !author) throw new AppError("Title and author are required", 400);
    const book = await addBook({ title, author, isbn });
    res.status(201).json({ book });
  } catch (err) {
    next(err);
  }
};

// GET /api/library/books
const getBooks = async (req, res, next) => {
  try {
    const books = await listBooks();
    res.json({ books });
  } catch (err) {
    next(err);
  }
};

// POST /api/library/issue
const postIssue = async (req, res, next) => {
  try {
    const { bookId, userId } = req.body;
    if (!bookId || !userId) throw new AppError("bookId and userId required", 400);
    const issue = await issueBook({ bookId: new ObjectId(bookId), userId: new ObjectId(userId) });
    res.status(201).json({ issue });
  } catch (err) {
    next(err);
  }
};

// POST /api/library/return
const postReturn = async (req, res, next) => {
  try {
    const { bookId, userId } = req.body;
    if (!bookId || !userId) throw new AppError("bookId and userId required", 400);
    await returnBook({ bookId: new ObjectId(bookId), userId: new ObjectId(userId) });
    res.json({ message: "Book returned" });
  } catch (err) {
    next(err);
  }
};

// GET /api/library/issues
const getIssues = async (req, res, next) => {
  try {
    const issues = await listIssues();
    res.json({ issues });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postBook,
  getBooks,
  postIssue,
  postReturn,
  getIssues,
};
