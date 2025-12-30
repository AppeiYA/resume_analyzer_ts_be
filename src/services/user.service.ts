import multer from "multer";
import { BadException } from "../errors/errors.js";
import { extractTextFromFile } from "../utils/ExtractText.js";
import { logger } from "../utils/logger.js";
import { analyzeResume } from "../utils/GeminiAnalyze.js";
export interface UserService {
  analyzeResume(
    file: Express.Multer.File,
    user_id: string
  ): Promise<any | BadException>;
}

export class UserServiceImpl implements UserService {
  constructor() {}
  async analyzeResume(
    file: Express.Multer.File,
    user_id: string
  ): Promise<any | BadException> {
    try {
      // extract text and return for now
      const result = await extractTextFromFile(file);
      //   try analyzing
      const analyzed = await analyzeResume(result);
      return analyzed;
    } catch (err) {
      logger.error(err);
      throw new BadException("Internal server error");
    }
  }
}

const userService = new UserServiceImpl();
export default userService;
