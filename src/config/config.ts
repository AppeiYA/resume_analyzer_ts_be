import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
}

export const ENV = {
  isProd: process.env.NODE_ENV === "production",
  PORT: process.env.PORT ?? 3000,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  JWT_SECRET: requireEnv("JWT_SECRET"),
  DATABASE_URL:
    process.env.NODE_ENV === "production"
      ? requireEnv("PRODUCTION_DATABASE_URL")
      : requireEnv("DATABASE_URL"),
  JWT_REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),
  GEMINI_API_KEY: requireEnv("GEMINI_API_KEY"),
  COOKIE_SECRET: requireEnv("COOKIE_SECRET"),
};
