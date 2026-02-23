const authService = require("../services/auth.service");
const { asyncHandler } = require("../utils/asyncHandler");

const buildCookieOptions = (req) => ({
  httpOnly: true,
  secure: req.app.get("env") === "production",
  sameSite: req.app.get("env") === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

const register = asyncHandler(async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.cookie("token", result.token, buildCookieOptions(req));
    res.status(201).json({ user: result.user });
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.cookie("token", result.token, buildCookieOptions(req));
  res.status(200).json({ user: result.user });
});

const me = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.id);
  res.status(200).json({ user: profile });
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("token");
  res.status(204).send();
});

module.exports = {
  register,
  login,
  me,
  logout
};
