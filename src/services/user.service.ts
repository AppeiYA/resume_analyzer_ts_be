import multer from "multer";
import { BadException } from "../errors/errors.js";
import { extractTextFromFile } from "../utils/ExtractText.js";
import { logger } from "../utils/logger.js";
import { analyzeResume } from "../utils/GeminiAnalyze.js";
import { UserRepositoryImpl, type UserRepository } from "../repositories/user.repository.js";
import { ResumeRepositoryImpl, type ResumeRepository } from "../repositories/resume.repository.js";
export interface UserService {
  analyzeResume(
    file: Express.Multer.File,
    user_id: string
  ): Promise<any | BadException>;
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
      if(!analyzed) return new BadException("Error in resume analysis")

      // after receiving analysis, save to db
      await this.resumeRepo.saveAnalysisReport(user_id, analyzed)

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
}

const userRepo = new UserRepositoryImpl()
const resumeRepo = new ResumeRepositoryImpl()

const userService = new UserServiceImpl(userRepo, resumeRepo);
export default userService;
