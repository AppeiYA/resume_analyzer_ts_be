import type { NextFunction, Request, Response } from "express";
import { AppResponse } from "../shared/RequestResponse.js";
import { StatusCodes } from "../shared/StatusCodes.js";
import { verifyToken } from "../utils/jwt.js";
import type { fnRequestWithClaim } from "../types/RequestType.js";
import { logger } from "../utils/logger.js";

export const AuthMiddleware = async (
  req: fnRequestWithClaim,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return AppResponse(
      res,
      "Unauthorized user",
      null,
      StatusCodes.UNAUTHORIZED
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return AppResponse(res, "Invalid token", null, StatusCodes.BAD_REQUEST);
  }

  try {
    const payload = await verifyToken(token);
    if (!payload.valid || payload.expired) {
      return AppResponse(res, "Invalid Token", null, StatusCodes.UNAUTHORIZED);
    }
    req.claim = payload.decoded;
    next();
  } catch (error) {
    logger.error(error);
    return AppResponse(res, "Invalid Token", null, StatusCodes.UNAUTHORIZED);
  }
};
