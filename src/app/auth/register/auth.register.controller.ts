import createError from "http-errors";
import type { NextFunction, Request, Response } from "express";
import { createUserService } from "../../user/user.service";
import { create } from "node:domain";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json({
      message: "User created successfully",
      user,
      success: true,
    });
  } catch (error: any) {
    next(createError(500, error.message || "User creation failed"));
  }
};
