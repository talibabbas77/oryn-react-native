import type { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: err.message, stack: process.env.NODE_ENV === "development" ? err.stack : null });
}

export const notFound = (_req: Request, res: Response, _next: NextFunction) => {
    const error = new Error(`Not Found - ${_req.originalUrl}`);
    res.status(404);
    _next(error);
}