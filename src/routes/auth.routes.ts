import express from "express";
import authController from "../controllers/auth.controller.js";
import { RequestValidateBodyMiddleware } from "../middleware/Request.validator.middleware.js";
import {
  CreateUserSchema,
  LoginUserSchema,
} from "../validators/user.schema.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  RequestValidateBodyMiddleware(CreateUserSchema),
  authController.registerUser
);

authRouter.post(
  "/login",
  RequestValidateBodyMiddleware(LoginUserSchema),
  authController.loginUser
);

authRouter.post(
  "/logout",
  authController.logout
)

authRouter.get(
  "/access_token",
  authController.getAccessToken
)

export default authRouter;
