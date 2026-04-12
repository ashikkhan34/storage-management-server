import express from "express";
import { refreshTokenController } from "./refreshToken.controller";
import { loginController } from "./login.controller";

const router = express.Router();

router.post("/refresh-token", refreshTokenController);
router.post("/logout", loginController);
router.post("/login", loginController);

export const loginRoute = router;