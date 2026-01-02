import express, { Router } from 'express'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';
import { upload } from '../middleware/multer.js';
import userController from '../controllers/user.controller.js';
import { RequestValidateParamsMiddleware } from '../middleware/Request.validator.middleware.js';
import { DeleteReportSchema } from '../validators/user.schema.js';

const userRouter:Router = express.Router();

userRouter.post(
    "/resume/analyze",
    AuthMiddleware,
    upload.single('file'),
    userController.analyzeResume
)
userRouter.get(
    "/resume",
    AuthMiddleware,
    userController.getAnalysisReports
)
userRouter.delete(
    "/resume/:report_id/delete",
    AuthMiddleware,
    RequestValidateParamsMiddleware(DeleteReportSchema),
    userController.deleteAnalysisReport
)

export default userRouter;