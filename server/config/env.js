import dotenv from "dotenv";

dotenv.config();

/**
 * Centralized environment variable validation.
 * Fails fast at startup if required variables are missing.
 */
const requiredVars = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "ENCRYPTION_KEY",
  "ENCRYPTION_IV",
];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `❌ Missing required environment variables:\n${missing.map((v) => `   • ${v}`).join("\n")}`
  );
  console.error(`\n   Copy .env.example to .env and fill in all values.\n`);
  process.exit(1);
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 5000,

  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI,

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || "15m",
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "7d",

  // Firebase Admin
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,

  // Encryption
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  ENCRYPTION_IV: process.env.ENCRYPTION_IV,

  // CORS
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

export default env;
