// src/app/upload/upload.controller.ts
import { Request, Response } from "express";
import {
  deleteFileService,
  getFilesByDateService,
  uploadFileService,
} from "./upload.service";

export const uploadFileController = async (req: Request, res: Response) => {
  try {
    const file = req.file!;
    const userId = (req as any).user.id;

    const data = await uploadFileService(file, userId);

    res.json({
      success: true,
      message: "File uploaded",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "file upload failed",
    });
  }
};

export const deleteFileController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await deleteFileService(id, userId);

    res.json({
      success: true,
      message: "File deleted",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFilesByDateController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate required",
      });
    }

    const data = await getFilesByDateService(
      userId,
      startDate as string,
      endDate as string,
    );

    res.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
