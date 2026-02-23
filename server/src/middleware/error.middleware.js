const { AppError } = require("../utils/appError");

const notFoundHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const errorHandler = (err, _req, res, _next) => {
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate key error"
    });
  }

  if (err.isJoi) {
    return res.status(400).json({
      message: "Validation error",
      details: err.details?.map((detail) => detail.message) || []
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal server error";

  return res.status(statusCode).json({
    message
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
