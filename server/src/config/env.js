const dotenv = require("dotenv");

dotenv.config();

const requireEnv = (key, defaultValue = undefined) => {
  if (!process.env[key]) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return process.env[key];
};

const env = {
  port: requireEnv("PORT"),
  mongoUri: requireEnv("MONGO_URI"),
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: requireEnv("JWT_EXPIRES_IN"),
  nodeEnv: requireEnv("NODE_ENV"),
  bcryptSaltRounds: requireEnv("BCRYPT_SALT_ROUNDS"),
  corsOrigins: requireEnv("CORS_ORIGIN")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
};

module.exports = { env };
