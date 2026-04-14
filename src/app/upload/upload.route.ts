import express from "express";
import { uploadController } from "./upload.controller";
import { upload } from "./upload.middleware";
import auth from "../../middleware/auth";

const router = express.Router();

// single file upload
router.post(
  "/",
  auth,
  upload.single("file"), // field name = file
  uploadController,
);

export const uploadRouter = router;
