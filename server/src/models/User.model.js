const bcrypt = require("bcryptjs");
const { env } = require("../config/env");
const { getDb } = require("../config/db");

const COLLECTION_NAME = "users";

const getCollection = () => getDb().collection(COLLECTION_NAME);

const hashPassword = async (password) => {
  const saltRounds = Number(env.bcryptSaltRounds);
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

const comparePassword = (candidatePassword, hashedPassword) => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};


// Allowed roles in the system (expandable)
const ALLOWED_ROLES = [
  "superadmin",
  "admin",
  "principal",
  "teacher",
  "student",
  "parent",
  "accountant",
  "librarian"
];

// Helper to create user with hashed password
const createUser = async (userData) => {
  if (!ALLOWED_ROLES.includes(userData.role)) {
    throw new Error(`Invalid role: ${userData.role}. Allowed roles: ${ALLOWED_ROLES.join(", ")}`);
  }
  const hashedPassword = await hashPassword(userData.password);
  const user = {
    ...userData,
    password: hashedPassword,
    isActive: userData.isActive !== undefined ? userData.isActive : true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const result = await getCollection().insertOne(user);
  return { _id: result.insertedId, ...user };
};

module.exports = {
  getCollection,
  hashPassword,
  comparePassword,
  createUser,
  ALLOWED_ROLES,
  COLLECTION_NAME
};
