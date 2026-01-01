import { query } from "../db/query.js";
import { BadException } from "../errors/errors.js";
import type { AnalysisResponse } from "../models/resume.js";
import { logger } from "../utils/logger.js";
import { resumeQueries } from "./queries/resume.queries.js";

export interface ResumeRepository {
  saveAnalysisReport(user_id: string, payload: AnalysisResponse): Promise<void>;
}

export class ResumeRepositoryImpl implements ResumeRepository {
  async saveAnalysisReport(
    user_id: string,
    payload: AnalysisResponse
  ): Promise<void> {
    try {
      await query(resumeQueries.SAVEANALYSIS, [
        user_id,
        payload.overall_score,
        payload.summary,
        payload.report_details,
      ]);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Create in db error: ${error.message}`);
        throw new BadException(error.message);
      }
      logger.error(error);
      throw new BadException("Internal server error");
    }
  }
}
