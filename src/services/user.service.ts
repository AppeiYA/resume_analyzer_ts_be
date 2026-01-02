import multer from "multer";
import { BadException, NotFoundError } from "../errors/errors.js";
import { extractTextFromFile } from "../utils/ExtractText.js";
import { logger } from "../utils/logger.js";
import { analyzeResume } from "../utils/GeminiAnalyze.js";
import {
  UserRepositoryImpl,
  type UserRepository,
} from "../repositories/user.repository.js";
import {
  ResumeRepositoryImpl,
  type ResumeRepository,
} from "../repositories/resume.repository.js";
import type { DeleteAnalysisReport, ResumeReport } from "../models/resume.js";
export interface UserService {
  analyzeResume(
    file: Express.Multer.File,
    user_id: string
  ): Promise<any | BadException>;
  getAnalysisReports(user_id: string): Promise<ResumeReport[]>;
  deleteResumeReport(payload: DeleteAnalysisReport): Promise<void>;
}

export class UserServiceImpl implements UserService {
  constructor(
    private userRepo: UserRepository,
    private resumeRepo: ResumeRepository
  ) {}
  async analyzeResume(
    file: Express.Multer.File,
    user_id: string
  ): Promise<any | BadException> {
    try {
      // extract text and return for now
      const result = await extractTextFromFile(file);
      //   try analyzing
      const analyzed = await analyzeResume(result);
      if (!analyzed) return new BadException("Error in resume analysis");

      // after receiving analysis, save to db
      await this.resumeRepo.saveAnalysisReport(user_id, analyzed);

      // after saving to db, return processed data
      return analyzed;
    } catch (err) {
      logger.error(err);
      if (err instanceof BadException) {
        throw err;
      }
      throw new BadException("Internal server error");
    }
  }
  async getAnalysisReports(user_id: string): Promise<ResumeReport[]> {
    try {
      return this.resumeRepo.getAnalysisReports(user_id);
    } catch (error) {
      throw error;
    }
  }
  async deleteResumeReport(payload: DeleteAnalysisReport): Promise<void> {
    try {
      const result = await this.resumeRepo.deleteAnalysisReport(payload);
      if (!result) throw new NotFoundError("Analysis deleted already or not found");
    } catch (error: any) {
      throw new BadException(error?.message ?? "Internal server error");
    }
  }
}

const userRepo = new UserRepositoryImpl();
const resumeRepo = new ResumeRepositoryImpl();

const userService = new UserServiceImpl(userRepo, resumeRepo);
export default userService;
