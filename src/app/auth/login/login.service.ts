import bcrypt from "bcrypt";
import type { ILoginData } from "./login.interface";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export const loginService = async (payload: ILoginData) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new Error("User not found with this email");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  //access token
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" },
  );

  //refresh token
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" },
  );
  return { user, accessToken, refreshToken };
};
