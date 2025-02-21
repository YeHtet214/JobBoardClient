import { config } from "dotenv";

config();

export const {
  NODE_ENV,
  DATABASE_URL,
  JWT_SECRET
} = process.env;