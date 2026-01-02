import { LoginResponseDto } from "../dtos/dtos.js";
import { BadException, NotFoundError } from "../errors/errors.js";
import type {
  CreateUserRequest,
  LoginUserRequest,
  LoginUserResponse,
} from "../models/users.js";
import {
  UserRepositoryImpl,
  type UserRepository,
} from "../repositories/user.repository.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { signToken, verifyRefreshToken } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";

export interface AuthService {
  registerUser(params: CreateUserRequest): Promise<void>;
  loginUser(
    params: LoginUserRequest
  ): Promise<LoginUserResponse | NotFoundError | BadException>;
  getAccessToken(refresh_token: string): Promise<string | BadException>;
}

export class AuthServiceImpl implements AuthService {
  constructor(private userRepo: UserRepository) {}

  async registerUser(params: CreateUserRequest): Promise<void> {
    try {
      // Check if email already exists
      const existingUser = await this.userRepo.getUserByEmail(params.email);
      console.log(existingUser);

      if (!(existingUser instanceof NotFoundError))
        throw new BadException("Email already in use");

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

  async loginUser(
    params: LoginUserRequest
  ): Promise<LoginUserResponse | NotFoundError | BadException> {
    try {
      // check if email exists
      const existingUser = await this.userRepo.getUserByEmail(params.email);
      if (existingUser instanceof NotFoundError) return existingUser;

      // compare password
      const passwordMatch = await comparePassword(
        params.password,
        existingUser.password_hash
      );

      if (!passwordMatch)
        return new BadException("Invalid email and password combination");

      // sign tokens
      const tokens = await signToken(
        { email: existingUser.email, user_id: existingUser.id },
        true
      );
      if (tokens instanceof Error) {
        throw new BadException(tokens.message);
      }

      const { token, newRefreshToken } = tokens;

      const result = {
        data: {
          id: existingUser.id,
          first_name: existingUser.first_name,
          last_name: existingUser.last_name,
          email: existingUser.email,
          created_at: existingUser.created_at,
        },
        token: token,
        refresh_token: newRefreshToken,
      } as LoginUserResponse;
      return result;
    } catch (error) {
      logger.error(error);
      throw new BadException("Internal server error");
    }
  }

  async getAccessToken(refresh_token: string): Promise<string | BadException> {
    // validate refresh_token
    const validate = await verifyRefreshToken(refresh_token);
    if (!validate.valid || validate.expired) {
      return new BadException("Invalid or expired refresh token");
    }
    // sign new token
    const token = await signToken(validate.decoded, false);
    if (token instanceof Error) {
      throw new Error("Error signing token");
    }
    return token.token;
  }
}

// Instantiate default service
const userRepo = new UserRepositoryImpl();
const authService = new AuthServiceImpl(userRepo);

export default authService;
