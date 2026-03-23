import { Request, Response, NextFunction } from "express";
import { isDev } from "../config";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal server error";

  res.status(statusCode).json({
    error: {
      message,
      code: err.code ?? "INTERNAL_ERROR",
      ...(isDev && { stack: err.stack }),
    },
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: { message: "Route not found", code: "NOT_FOUND" } });
}

export function createError(message: string, statusCode = 500, code?: string): AppError {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  err.code = code;
  return err;
}
