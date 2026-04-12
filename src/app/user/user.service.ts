import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import type { IUser } from "./user.interface";

export const createUserService = async (payload: IUser) => {
  const hash = await bcrypt.hash(payload.password, 10);
  const user = await prisma.user.create({
    data: {
      email: payload.email,
      password: hash,
      name: payload.name,
    },
  });
  return user;
};
