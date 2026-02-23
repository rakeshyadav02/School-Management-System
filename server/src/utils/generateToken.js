const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

const generateToken = (user) =>
  jwt.sign(
    {
      role: user.role
    },
    env.jwtSecret,
    {
      subject: user._id.toString(),
      expiresIn: env.jwtExpiresIn
    }
  );

module.exports = { generateToken };
