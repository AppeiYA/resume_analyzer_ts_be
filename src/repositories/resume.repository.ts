import { query } from "../db/query.js";
import { BadException, InternalServerError } from "../errors/errors.js";
import type {
  AnalysisResponse,
  DeleteAnalysisReport,
  ResumeReport,
} from "../models/resume.js";
import { logger } from "../utils/logger.js";
import { resumeQueries } from "./queries/resume.queries.js";

export interface ResumeRepository {
  saveAnalysisReport(user_id: string, payload: AnalysisResponse): Promise<void>;
  getAnalysisReports(user_id: string): Promise<ResumeReport[]>;
  deleteAnalysisReport(
    payload: DeleteAnalysisReport
  ): Promise<ResumeReport | null>;
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

  async getAnalysisReports(user_id: string): Promise<ResumeReport[]> {
    try {
      const result = await query(resumeQueries.GETUSERPREVIOUSANALYSIS, [
        user_id,
      ]);
      if (!result) return [];
      return result.rows as ResumeReport[];
    } catch (error: any) {
      if (error instanceof Error) {
        throw new BadException(error.message);
      }
      throw new InternalServerError();
    }
  }

  async deleteAnalysisReport(
    payload: DeleteAnalysisReport
  ): Promise<ResumeReport | null> {
    const { rows } = await query(resumeQueries.DELETERESUMEREPORT, [
      payload.user_id,
      payload.report_id,
    ]);

    return rows[0] ?? null
  }
}
