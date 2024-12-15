import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_NAME,
  api_key: process.env.CLOUDNARY_API,
  api_secret: process.env.CLOUDNARY_API_SECRET,
});

export default cloudinary;
