import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload = async (file: string, folder: string) => {
  const result = await cloudinary.uploader.upload(file, {
    folder,
  });
  return {
    url: result.secure_url,
    id: result.asset_id,
  };
};

const uploader = async (path: string) => await upload(path, "bankApp");

export const uploadImages = async (files: Array<Express.Multer.File>) => {
  const links = [];
  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    links.push(newPath.url);
    fs.unlinkSync(path);
  }
  return links;
};

export default cloudinary;
