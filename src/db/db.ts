import { Pool, type PoolClient } from "pg";
import { ENV } from "../config/config.js";
import { logger } from "../utils/logger.js";

export const DB = new Pool({
  connectionString: ENV.DATABASE_URL,
  ssl: ENV.isProd ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});
let logged: boolean = false;
DB.on("connect", () => {
  if (!logged) {
    logger.info(`Database client connected`);
    logged = true;
  }
});

DB.on("error", (err: Error) => {
  logger.error(`Unexpected error in database client: ${err.message}`);
  process.exit(1);
});
