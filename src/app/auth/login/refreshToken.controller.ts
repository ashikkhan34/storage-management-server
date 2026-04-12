import createError  from "http-errors";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
        throw new createError.Unauthorized("No refresh token provided");
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || "",
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "15m" },
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(new createError.Unauthorized("Refresh token invalid or expired"));
  }
};