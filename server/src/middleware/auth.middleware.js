const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { AppError } = require("../utils/appError");

const authenticate = (req, _res, next) => {
  const header = req.headers.authorization;
  const bearerToken = header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;
  const token = bearerToken || req.cookies?.token;

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: payload.sub,
      role: payload.role
    };
    return next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
};

module.exports = { authenticate };
