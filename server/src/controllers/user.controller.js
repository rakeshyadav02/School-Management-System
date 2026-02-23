const userService = require("../services/user.service");
const { asyncHandler } = require("../utils/asyncHandler");

const listUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, role } = req.query;
  const filters = {};
  if (search) filters.search = search;
  if (role) filters.role = role;

  const result = await userService.listUsers(parseInt(page), parseInt(limit), filters);
  res.status(200).json(result);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({ user });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await userService.createUser({ name, email, password, role });
  res.status(201).json({ user });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(200).json({ user });
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id, req.user.id);
  res.status(204).send();
});

const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  await userService.resetUserPassword(req.params.id, newPassword);
  res.status(200).json({ message: "Password reset successfully" });
});

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword
};
