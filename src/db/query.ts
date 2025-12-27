import { DB } from "./db.js";
import { logger } from "../utils/logger.js";
import type { QueryResult, QueryResultRow } from "pg";

/**
 * Execute a database query with error handling and logging
 * @param text - SQL query string
 * @param params - Query parameters (for parameterized queries)
 * @returns Promise<QueryResult<T>>
 * @throws Error with database error details
 */
export const query = async <T extends QueryResultRow = any>(
  text: string,
  params: any[] = []
): Promise<QueryResult<T>> => {
  try {
    // Validate inputs
    if (!text || typeof text !== "string") {
      throw new Error("Query text must be a non-empty string");
    }

    if (!Array.isArray(params)) {
      throw new Error("Query parameters must be an array");
    }

    logger.debug(`Executing query: ${text}`);

    const result = await DB.query<T>(text, params);

    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";

    logger.error(`Database query failed: ${errorMessage}`);
    throw new Error(`Database query failed: ${errorMessage}`);
  }
};
