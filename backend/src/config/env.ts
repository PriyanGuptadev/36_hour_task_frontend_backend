import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const ENV = {
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017",
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "visit_tracker",
};