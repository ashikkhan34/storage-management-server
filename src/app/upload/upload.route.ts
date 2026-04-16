// src/app/upload/upload.route.ts
import express from "express";
import auth from "../../middleware/auth";
import { upload } from "./upload.middleware";
import {
  deleteFileController,
  getFilesByDateController,
  uploadFileController,
} from "./upload.controller";

const router = express.Router();

router.post("/", auth, upload.single("file"), uploadFileController);
router.get("/filter", auth, getFilesByDateController);

router.delete("/:id", auth, deleteFileController);

export const uploadRouter = router;
