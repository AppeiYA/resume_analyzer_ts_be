import type { Response } from "express";
import { refreshCookieOptions } from "../utils/cookie.js";

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
export const AppResponseWithCookie = (
  res: Response,
  message: string,
  data: unknown = "",
  statusCode: number,
  cookieData: string
) => {
  return res
    .cookie("ran", cookieData, refreshCookieOptions)
    .status(statusCode)
    .json({
      status: statusCode < 400 ? "success" : "error",
      message: message,
      data: data,
    });
};

export const ClearCookie = (
  res: Response,
  message: string,
  data: unknown = "",
  statusCode: number,
) => {
  return res
    .clearCookie("ran", refreshCookieOptions)
    .status(statusCode)
    .json({
      status: statusCode < 400 ? "success" : "error",
      message: message,
      data: data,
    });
};


