import type { Request, Response } from "express";
import authService, { type AuthService } from "../services/auth.service.js";
import { StatusCodes } from "../shared/StatusCodes.js";
import { BadException, NotFoundError } from "../errors/errors.js";
import type { CreateUserRequest } from "../models/users.js";

export class AuthController {
    constructor(private authServ: AuthService){}
    public registerUser = async (req: Request, res: Response) => {
        try{
            const payload: CreateUserRequest = req.body
            await this.authServ.registerUser(payload)
            return res.status(StatusCodes.CREATED).json({
                message: "User Registered successfully"
            })
        }catch(error){
            if (error instanceof NotFoundError){
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: error.message
                })
            }
            if (error instanceof BadException){
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: error.message
                })
            }
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error"
            })
        }
    }
}

const authController = new AuthController(authService)
export default authController;