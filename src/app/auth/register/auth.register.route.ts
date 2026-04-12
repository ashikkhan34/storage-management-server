import express from "express";
import { registerController } from "./auth.register.controller";

const router = express.Router();

router.post("/register", registerController);

export const registerRoute = router;
