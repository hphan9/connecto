import express from "express";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import postRoutes from "./routes/post.route";
import notificationRoutes from "./routes/notification.route";
import connectMongoDB from "./db/connectMongoDB";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import { MessageBroker } from "./utils/broker";
import { Message } from "kafkajs";

export const ExpressApp = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const app = express();

  app.use(express.json({ limit: "5mb" })); // to parse req.json , limit should not be to big to prevent DOS
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  const producer = await MessageBroker.connectProducer();
  producer.on("producer.connect", () => {
    console.log("producer connected");
  });
  const consumer = await MessageBroker.connectConsumer();
  consumer.on("consumer.connect", () => {
    console.log("consumer connected");
  });

  await MessageBroker.subscribe((message: Message) => {
    console.log("Message", message);
  }, "PostEvents");

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/notifications", notificationRoutes);
  await connectMongoDB();

  return app;
};
