import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import expressFileupload from "express-fileupload";
import bodyParser from "body-parser";

dotenv.config();
import { app, server } from "./lib/socket-io.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
app.use(
  cors({
    origin: process.env.VITE_CLIENT_HOST,
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(expressFileupload());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use(cookieParser());

import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import statusRoute from "./routes/status.route.js";
import groupRoute from "./routes/group.route.js";
import callRoute from "./routes/call.route.js";
import adminRoute from "./routes/admin.route.js";
import { connDB } from "./lib/db.js";

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("hello from server side");
});

const uploadDir = path.join(__dirname, "../upload");

app.use("/upload", express.static("upload"));
app.use("/auth", authRoute);
app.use("/message", messageRoute);
app.use("/group", groupRoute);
app.use("/status", statusRoute);
app.use("/call", callRoute);
app.use("/admin", adminRoute);
app.post("/audio/upload", async (req, res) => {
  if (!req.files)
    return res.status(200).json({ message: "Audio Not Receive", success: 0 });

  const { audio } = req.files;
  const { name } = req.body;
  audio.mv(path.join(`${uploadDir}/audio`, `${name}.mp3`));
  res.status(200).json({
    success: 1,
    name: `${name}.mp3`,
    size: audio.size,
  });
});

server.listen(PORT, () => {
  console.log(`server start on http://localhost:${PORT}`);
  connDB();
});
