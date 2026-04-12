import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";
import type { IRegisterData } from "./auth.register.interface";
import { v4 as uuidv4 } from "uuid";

export const registerService = async (payload: IRegisterData) => {
  const { email, name, password } = payload;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hash = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email,
      name,
      password: hash,
    },
  });
  return newUser;
};
