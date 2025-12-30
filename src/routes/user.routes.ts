import express, { Router } from 'express'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';
import { upload } from '../middleware/multer.js';
import userController from '../controllers/user.controller.js';

const userRouter:Router = express.Router();

userRouter.post(
    "/resume/analyze",
    AuthMiddleware,
    upload.single('file'),
    userController.analyzeResume
)

export default userRouter;