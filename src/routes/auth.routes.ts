import express from "express";
import authController from "../controllers/auth.controller.js";
import { RequestValidateBodyMiddleware } from "../middleware/Request.validator.middleware.js";
import { CreateUserSchema } from "../validators/user.schema.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  RequestValidateBodyMiddleware(CreateUserSchema),
  authController.registerUser
);

export default authRouter;
