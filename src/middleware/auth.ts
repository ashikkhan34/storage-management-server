import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_ACCESS_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined");
}

const auth = (req: any, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    // console.log("token..", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Attach user to req object
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error("Auth middleware error:", error.message);

    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

export default auth;
