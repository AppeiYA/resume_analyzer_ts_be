import type { Response } from "express";
import type { UserService } from "../services/user.service.js";
import type { fnRequestWithClaim } from "../types/RequestType.js";
import { AppResponse } from "../shared/RequestResponse.js";
import { StatusCodes } from "../shared/StatusCodes.js";
import { BadException, NotFoundError } from "../errors/errors.js";
import userService from "../services/user.service.js";

class UserController {
  constructor(private userSrv: UserService) {}

  public analyzeResume = async (req: fnRequestWithClaim, res: Response) => {
    if (!req.file) {
      return AppResponse(
        res,
        "No file uploaded",
        null,
        StatusCodes.BAD_REQUEST
      );
    }
    const user_id = req.claim.user_id;
    try {
      const result = await this.userSrv.analyzeResume(req.file, user_id);

      return AppResponse(res, "Successful extract", result, StatusCodes.OK);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return AppResponse(res, error.message, null, error.statusCode);
      }
      if (error instanceof BadException) {
        return AppResponse(res, error.message, null, error.statusCode);
      }
      return AppResponse(
        res,
        "Internal server error",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };
}

const userController = new UserController(userService);

export default userController;
