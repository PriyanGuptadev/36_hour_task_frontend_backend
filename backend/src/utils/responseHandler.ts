import { Response } from "express";

export class ResponseHandler {
    static success<T>(res: Response, message: string, data?: T, statusCode: number = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data: data ?? null,
        });
    }

    static error(res: Response, message: string, statusCode: number = 400, errors?: any) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors: errors ?? null,
        });
    }
}