import dotenv from "dotenv";

dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT || 5000),

  db: {
    host: getRequiredEnv("DB_HOST"),
    port: Number(getRequiredEnv("DB_PORT")),
    user: getRequiredEnv("DB_USER"),
    password: getRequiredEnv("DB_PASSWORD"),
    database: getRequiredEnv("DB_NAME"),
  },
};