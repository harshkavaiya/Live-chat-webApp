import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import expressFileupload from "express-fileupload";
import { app, server } from "./lib/socket-io.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(expressFileupload());

app.use(cookieParser());

import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import statusRoute from "./routes/status.route.js"
import { connDB } from "./lib/db.js";

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("hello from server side");
});

const uploadDir = path.join(__dirname, "../upload");

app.use("/upload", express.static("upload"));
app.use("/auth", authRoute);
app.use("/message", messageRoute);
app.use("/status",statusRoute)
app.post("/audio/upload", async (req, res) => {
  if (!req.files)
    return res.status(404).json({ message: "Audio Not Receive", success: 0 });

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
