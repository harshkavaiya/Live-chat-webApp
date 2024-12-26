import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import expressFileupload from "express-fileupload";
import { app, server, io, getUserSocketId } from "./lib/socket-io.js";
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
import { connDB } from "./lib/db.js";

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("hello from server side");
});

app.use("/auth", authRoute);
app.use("/message", messageRoute);

app.post("/api/file", async (req, res) => {
  console.log(req.body);
  res.status(200).json({ success: 1, data: req.body });
});

server.listen(PORT, () => {
  console.log(`server start on http://localhost:${PORT}`);
  connDB();
});
