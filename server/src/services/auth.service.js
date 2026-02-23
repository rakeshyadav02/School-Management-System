const { ObjectId } = require("mongodb");
const { getCollection, createUser, comparePassword } = require("../models/User.model");
const { AppError } = require("../utils/appError");
const { generateToken } = require("../utils/generateToken");

const register = async ({ name, email, password, role }) => {
  const existingUser = await getCollection().findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("Email already in use", 409);
  }

  const user = await createUser({
    name,
    email: email.toLowerCase(),
    password,
    role: role || "student"
  });

  const token = generateToken(user);
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
};

const login = async ({ email, password }) => {
  const user = await getCollection().findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken(user);
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
};

const getProfile = async (userId) => {
  const user = await getCollection().findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

module.exports = {
  register,
  login,
  getProfile
};
