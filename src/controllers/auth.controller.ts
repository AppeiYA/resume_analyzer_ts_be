import type { Request, Response } from "express";
import authService, { type AuthService } from "../services/auth.service.js";
import { StatusCodes } from "../shared/StatusCodes.js";
import { BadException, NotFoundError } from "../errors/errors.js";
import type { CreateUserRequest, LoginUserRequest } from "../models/users.js";
import { LoginUserDto } from "../dtos/dtos.js";
import {
  AppResponse,
  AppResponseWithCookie,
  ClearCookie,
} from "../shared/RequestResponse.js";

export class AuthController {
  constructor(private authServ: AuthService) {}

  public registerUser = async (req: Request, res: Response) => {
    try {
      const payload: CreateUserRequest = req.body;
      await this.authServ.registerUser(payload);
      return AppResponse(
        res,
        "User registered successfully",
        null,
        StatusCodes.CREATED
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        return AppResponse(res, error.message, null, error.statusCode);
      }
      if (error instanceof BadException) {
        return AppResponse(res, error.message, null, error.statusCode);
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  };

  public loginUser = async (req: Request, res: Response) => {
    const payload = req.body as LoginUserRequest;

    try {
      const result = await this.authServ.loginUser(payload);
      if (result instanceof NotFoundError) {
        return AppResponse(res, result.message, null, result.statusCode);
      }
      if (result instanceof BadException) {
        return AppResponse(res, result.message, null, result.statusCode);
      }
      const { refresh_token, ...response } = result;

      return AppResponseWithCookie(
        res,
        "Login successful",
        response,
        StatusCodes.OK,
        refresh_token
      );
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

  public getAccessToken = async (req: Request, res: Response) => {
    const refresh_token = req.cookies.ran;
    if (!refresh_token) {
      return AppResponse(res, "User already logged out", null, StatusCodes.NOT_FOUND);
    }
    try {
      const result = await this.authServ.getAccessToken(refresh_token);
      if (result instanceof BadException) {
        return AppResponse(res, result.message, null, result.statusCode);
      }

      return AppResponse(
        res,
        "New Access Token",
        { token: result },
        StatusCodes.OK
      );
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        return AppResponse(res, error.message, null, error.statusCode);
      }
      if (error instanceof BadException) {
        return AppResponse(res, error.message, null, error.statusCode);
      }
      return AppResponse(
        res,
        `Internal server error: ${error?.message}`,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  public logout = async (req: Request, res: Response) => {
    const token = req.cookies.ran;
        if (!token) {
          return AppResponse(
            res,
            "User already logged out",
            null,
            StatusCodes.NOT_FOUND
          );
        }
    const response = await this.authServ.logout(token);
    if (response instanceof BadException) {
      return AppResponse(res, response.message, null, response.statusCode);
    }

    return ClearCookie(res, "Log Out Successful", null, StatusCodes.OK);
  };
}

const authController = new AuthController(authService);
export default authController;
