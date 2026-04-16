import streamifier from "streamifier";
import { bytesToMB } from "../../utils/bytesToMB";
import { prisma } from "../../lib/prisma";
import cloudinary from "../../utils/cloudinary";

export const uploadFileService = async (
  file: Express.Multer.File,
  userId: string,
) => {
  const fileSizeMB = bytesToMB(file.size);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  // 🚫 Storage limit check
  if (user.used + fileSizeMB > user.storage) {
    throw new Error("Storage limit exceeded (15GB)");
  }

  // 📤 Upload to cloudinary
  const result: any = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "uploads",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });

  // 💾 Save DB
  const upload = await prisma.upload.create({
    data: {
      fileName: result.public_id,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: fileSizeMB,
      url: result.secure_url,
      publicId: result.public_id,
      userId,
    },
  });

  // 📊 Update storage
  await prisma.user.update({
    where: { id: userId },
    data: {
      used: {
        increment: fileSizeMB,
      },
    },
  });

  return upload;
};

export const deleteFileService = async (id: string, userId: string) => {
  const file = await prisma.upload.findUnique({
    where: { id },
  });

  if (!file) throw new Error("File not found");

  if (file.userId !== userId) throw new Error("Unauthorized");

  // delete from cloudinary
  await cloudinary.uploader.destroy(file.publicId, {
    resource_type: "auto",
  });

  // delete from DB
  await prisma.upload.delete({
    where: { id },
  });

  // reduce storage
  await prisma.user.update({
    where: { id: userId },
    data: {
      used: {
        decrement: file.size,
      },
    },
  });

  return true;
};

// date wise filter

export const getFilesByDateService = async (
  userId: string,
  startDate: string,
  endDate: string,
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 👉 end date full day include করার জন্য
  end.setHours(23, 59, 59, 999);

  const files = await prisma.upload.findMany({
    where: {
      userId,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return files;
};
