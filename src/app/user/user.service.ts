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
// get all users
export const getAllUsersService = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      // password hide ✔
    },
  });

  return users;
};

export const getUserByIdService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      storage: true,
      used: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUserService = async (
  id: string,
  payload: Partial<IUser>,
) => {
  // password update হলে hash করতে হবে
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    },
  });

  return user;
};

export const deleteUserService = async (id: string) => {
  const user = await prisma.user.delete({
    where: { id },
  });

  return user;
};
