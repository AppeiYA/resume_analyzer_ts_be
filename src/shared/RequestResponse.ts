import type { Response } from "express";

export const AppResponse = (
  res: Response,
  message: string,
  data: unknown = "",
  statusCode: number
) => {
  return res.status(statusCode).json({
    status: statusCode < 400 ? "success" : "error",
    message: message,
    data: data,
  });
};
