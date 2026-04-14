import { Request, Response } from "express";
import { uploadItemService } from "./upload.service";

export const uploadController = async (req: any, res: Response) => {
  try {
    const file = req.file;
    // 🔥 Safe check
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated...",
      });
    }
    const userId = req.user.id; // from auth middleware
    const fileId = req.body.fileId;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await uploadItemService({
      file,
      userId,
      fileId,
    });

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "file upload failed....",
    });
  }
};
