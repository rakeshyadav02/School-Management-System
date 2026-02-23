const { getDb } = require("../config/db");

const BOOKS_COLLECTION = "books";
const ISSUES_COLLECTION = "book_issues";

const getBooksCollection = () => getDb().collection(BOOKS_COLLECTION);
const getIssuesCollection = () => getDb().collection(ISSUES_COLLECTION);

const addBook = async (data) => {
  const doc = { ...data, available: true, createdAt: new Date(), updatedAt: new Date() };
  const result = await getBooksCollection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

const listBooks = async (filter = {}) => {
  return getBooksCollection().find(filter).sort({ createdAt: -1 }).toArray();
};

const issueBook = async ({ bookId, userId }) => {
  // Mark book as unavailable
  await getBooksCollection().updateOne({ _id: bookId }, { $set: { available: false, updatedAt: new Date() } });
  // Record issue
  const doc = { bookId, userId, issuedAt: new Date(), returnedAt: null };
  const result = await getIssuesCollection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

const returnBook = async ({ bookId, userId }) => {
  // Mark book as available
  await getBooksCollection().updateOne({ _id: bookId }, { $set: { available: true, updatedAt: new Date() } });
  // Record return
  await getIssuesCollection().updateOne(
    { bookId, userId, returnedAt: null },
    { $set: { returnedAt: new Date() } }
  );
};

const listIssues = async (filter = {}) => {
  return getIssuesCollection().find(filter).sort({ issuedAt: -1 }).toArray();
};

module.exports = {
  addBook,
  listBooks,
  issueBook,
  returnBook,
  listIssues,
};
