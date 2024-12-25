import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
console.log(
  process.env.CLOUD_NAME,
  process.env.CLOUDARY_API_KEY,
  process.env.CLOUDARY_API_SECERET
);
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDARY_API_KEY,
  api_secret: process.env.CLOUDARY_API_SECERET,
});

export default cloudinary;
