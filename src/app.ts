import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { userRoute } from "./app/user/user.route";
import { registerRoute } from "./app/auth/register/auth.register.route";
import { loginRoute } from "./app/auth/login/login.route";
import { noteRouter } from "./app/note/note.route";
import { fileRouter } from "./app/file/file.route";
import { uploadRouter } from "./app/upload/upload.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use(globalErrorHandler);

app.use("/api/users", userRoute);
app.use("/api/auth", registerRoute);
app.use("/api/auth", loginRoute);
app.use("/api/auth", loginRoute);
app.use("/api/note", noteRouter);
app.use("/api/file", fileRouter);
app.use("/api/upload-file", uploadRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
