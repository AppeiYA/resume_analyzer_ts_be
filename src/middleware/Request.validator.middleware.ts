import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";
import { StatusCodes } from "../shared/StatusCodes.js";
import { AppResponse } from "../shared/RequestResponse.js";

export const RequestValidateBodyMiddleware =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      return AppResponse(res, "no request body", null, StatusCodes.BAD_REQUEST);
    }
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return AppResponse(
        res,
        "Validation failed",
        error.details.map((d) => d.message),
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    }
    req.body = value;
    next();
  };
export const RequestValidateParamsMiddleware =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return AppResponse(
        res,
        "Validation failed",
        error.details.map((d) => d.message),
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    }
    req.body = value;
    next();
  };
