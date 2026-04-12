import type { NextFunction, Request, Response } from "express";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;

  res.send(statusCode).json({
    message: err.message || "Something went wrong",
    success: false,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
