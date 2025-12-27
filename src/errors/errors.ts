import { StatusCodes } from "../shared/StatusCodes.js";

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode:number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype)
        Error.captureStackTrace?.(this, this.constructor)
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = "Resource not found") {
        super(message, StatusCodes.NOT_FOUND);
    }
}

export class BadException extends AppError {
    constructor(message: string = 'Bad request'){
        super(message, StatusCodes.BAD_REQUEST)
    }
}