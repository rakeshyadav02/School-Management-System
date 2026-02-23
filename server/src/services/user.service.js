const { ObjectId } = require("mongodb");
const { getCollection, createUser: createUserModel, hashPassword } = require("../models/User.model");
const { AppError } = require("../utils/appError");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

// List all users with pagination
const listUsers = async (page = 1, limit = 10, filters = {}) => {
  const { skip, limit: finalLimit } = getPagination(page, limit);

  let query = {};
  if (filters.role) query.role = filters.role;
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } }
    ];
  }

  const total = await getCollection().countDocuments(query);
  const users = await getCollection()
    .find(query, { projection: { password: 0 } })
    .limit(finalLimit)
    .skip(skip)
    .toArray();

  return {
    users,
    pagination: getPaginationMeta(total, page, limit)
  };
};

// Get user by ID
const getUserById = async (userId) => {
  const user = await getCollection().findOne(
    { _id: new ObjectId(userId) },
    { projection: { password: 0 } }
  );
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

// Create user (admin only)
const createUser = async ({ name, email, password, role }) => {
  const existingUser = await getCollection().findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("Email already in use", 409);
  }


  const { ALLOWED_ROLES } = require("../models/User.model");
  if (!ALLOWED_ROLES.includes(role)) {
    throw new AppError(`Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}`, 400);
  }

  const user = await createUserModel({
    name,
    email: email.toLowerCase(),
    password,
    role,
    isActive: true
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive
  };
};

// Update user (admin only)
const updateUser = async (userId, updates) => {
  const { name, email, role, isActive, password } = updates;


  const { ALLOWED_ROLES } = require("../models/User.model");
  if (role && !ALLOWED_ROLES.includes(role)) {
    throw new AppError(`Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}`, 400);
  }

  if (email) {
    const existingUser = await getCollection().findOne({ 
      email: email.toLowerCase(), 
      _id: { $ne: new ObjectId(userId) } 
    });
    if (existingUser) {
      throw new AppError("Email already in use by another user", 409);
    }
  }

  const updateData = { updatedAt: new Date() };
  if (name) updateData.name = name;
  if (email) updateData.email = email.toLowerCase();
  if (role) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (password) updateData.password = await hashPassword(password);

  const result = await getCollection().findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: updateData },
    { returnDocument: "after", projection: { password: 0 } }
  );

  if (!result) {
    throw new AppError("User not found", 404);
  }

  return result;
};

// Delete user (admin only, cannot delete self)
const deleteUser = async (userId, adminId) => {
  if (userId === adminId.toString()) {
    throw new AppError("Cannot delete your own account", 403);
  }

  const result = await getCollection().deleteOne({ _id: new ObjectId(userId) });
  if (result.deletedCount === 0) {
    throw new AppError("User not found", 404);
  }

  return { message: "User deleted successfully" };
};

// Reset user password (admin only)
const resetUserPassword = async (userId, newPassword) => {
  if (!newPassword || newPassword.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }

  const hashedPassword = await hashPassword(newPassword);
  const result = await getCollection().updateOne(
    { _id: new ObjectId(userId) },
    { $set: { password: hashedPassword, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    throw new AppError("User not found", 404);
  }

  return { message: "Password reset successfully" };
};

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword
};
