import { NextFunction, Request, Response } from "express";
import { Controller } from "../types/type.js";
import ApiError from "../utils/ApiError.js";

export const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const message = err.message || "Internal Server Error";
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message,
  });
};

//asyncHandler

export const asyncHandler = (func: Controller) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
