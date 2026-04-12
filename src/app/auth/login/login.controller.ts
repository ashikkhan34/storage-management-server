import type { NextFunction, Request, Response } from "express";
import { loginService } from "./login.service";
import createError from "http-errors";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, accessToken, refreshToken } = await loginService(req.body);
    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      data: { user, accessToken },
      success: true,
    });
  } catch (error: any) {
    next(createError(500, error.message || "Login failed"));
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error: any) {
    next(createError(500, error.message || "Logout failed"));
  }
};
