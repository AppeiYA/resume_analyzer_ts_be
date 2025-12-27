import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";
import { StatusCodes } from "../shared/StatusCodes.js";

export const RequestValidateBodyMiddleware =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    if(!req.body){
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "no request body"
        })
    }
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(422).json({
        message: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }
    req.body = value;
    next();
  };
