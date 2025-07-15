import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { ValidationError } from "express-validator";

export class AppError extends Error {
    public status: string;
    public isOperational: boolean;
    public errors?: ValidationError[];

    constructor(message: string, public statusCode: number, errors?: ValidationError[]) {
        super(message);
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error: ${err.message}`);
    res.status(err.statusCode || 500).json({
        success: false,
        status: err.status || "error",
        message: err.message || "Internal Server Error",
        errors: err.errors || undefined,
    });
};