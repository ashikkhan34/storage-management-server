// upload.service.ts
import { prisma } from "../../lib/prisma";
import cloudinary from "../../utils/cloudinary";
import streamifier from "streamifier";

const bytesToMB = (bytes: number) => bytes / (1024 * 1024);

const uploadToCloudinary = (file: Express.Multer.File) => {
  return new Promise<any>((resolve, reject) => {
    if (!file?.buffer) {
      return reject(new Error("File buffer missing"));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "storage-app",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const uploadItemService = async ({
  file,
  userId,
  fileId,
}: {
  file: Express.Multer.File;
  userId: string;
  fileId: string;
}) => {
  const uploaded = await uploadToCloudinary(file);

  const sizeInMB = bytesToMB(uploaded.bytes);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  if (user.used + sizeInMB > user.storage) {
    throw new Error("Storage limit exceeded");
  }

  const item = await prisma.upload.create({
    data: {
      fileId,
      userId,
      url: uploaded.secure_url,
      size: sizeInMB,
      type: uploaded.resource_type,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      used: user.used + sizeInMB,
    },
  });

  return item;
};
