import { BadException, NotFoundError } from "../errors/errors.js";
import type { CreateUserRequest } from "../models/users.js";
import {
  UserRepositoryImpl,
  type UserRepository,
} from "../repositories/user.repository.js";
import { hashPassword } from "../utils/bcrypt.js";
import { logger } from "../utils/logger.js";

export interface AuthService {
  registerUser(params: CreateUserRequest): Promise<void>;
}

export class AuthServiceImpl implements AuthService {
  constructor(private userRepo: UserRepository) {}

  async registerUser(params: CreateUserRequest): Promise<void> {
    try {
      // Check if email already exists
      const existingUser = await this.userRepo
        .getUserByEmail(params.email)
        .catch((err) => {
          if (err instanceof NotFoundError) return null;
          throw err;
        });

      if (existingUser) {
        throw new BadException("Email already in use");
      }

      // Hash password
      const hashedPassword = await hashPassword(params.password);

      await this.userRepo.createUser({
        ...params,
        password: hashedPassword,
      });
    } catch (error) {
      // Log error
      logger.error(
        `Error creating user: ${
          error instanceof Error ? error.message : "Internal server error"
        }`
      );

      // Re-throw as BadException
      throw new BadException(
        error instanceof Error ? error.message : "Internal server error"
      );
    }
  }
}

// Instantiate default service
const userRepo = new UserRepositoryImpl();
const authService = new AuthServiceImpl(userRepo);

export default authService;
