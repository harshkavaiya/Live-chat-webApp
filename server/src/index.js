import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connDB } from "./lib/db.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("hello from server side");
});

app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log(`server start on http://localhost:${PORT}`);
  connDB();
});
