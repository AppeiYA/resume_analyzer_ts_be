import { query } from "../db/query.js";
import { BadException, NotFoundError } from "../errors/errors.js";
import type { CreateUserRequest, User } from "../models/users.js";
import { logger } from "../utils/logger.js";
import { userQueries } from "./queries/user.queries.js";

export interface UserRepository {
  createUser(params: CreateUserRequest): Promise<void>;
  getUserByEmail(email: string): Promise<User | NotFoundError>;
}

export class UserRepositoryImpl implements UserRepository {
  async createUser(params: CreateUserRequest): Promise<void> {
    try {
      await query(userQueries.CREATEUSER, [
        params.first_name,
        params.last_name,
        params.email,
        params.password,
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

  async getUserByEmail(email: string): Promise<User | NotFoundError> {
    const result = await query<User>(userQueries.GETUSERBYEMAIL, [email]);

    if (!result.rows[0]) {
      return new NotFoundError("User not found");
    }

    return result.rows[0];
  }
}
