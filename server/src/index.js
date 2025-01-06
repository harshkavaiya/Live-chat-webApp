import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import expressFileupload from "express-fileupload";
import { app, server, } from "./lib/socket-io.js";
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


server.listen(PORT, () => {
  console.log(`server start on http://localhost:${PORT}`);
  connDB();
});
