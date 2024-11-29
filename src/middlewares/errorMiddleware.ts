import { NextFunction, Request, Response } from "express";
import ErrorHandlor from "../utils/ApiError.js";
import { Controller } from "../types/type.js";

export const errorMiddleware = (
  err: ErrorHandlor,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

//asyncHandler

export const asyncHandler = (func: Controller) => {
  return (req: Response, res: Request, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
};
