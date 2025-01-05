import express from "express";
import postRoutes from "./routes/post.routes";
import connectMongoDB from "./db/connectMongoDB";
// import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import { InitializeBroker } from "./services/broker.services";

export const ExpressApp = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const app = express();

  app.use(express.json({ limit: "5mb" })); // to parse req.json , limit should not be to big to prevent DOS
  app.use(express.urlencoded({ extended: true }));
  //app.use(cookieParser());

  await InitializeBroker();

  app.use("/", postRoutes);
  await connectMongoDB();

  return app;
};
