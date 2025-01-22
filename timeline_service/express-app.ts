import express from "express";
import feedRoutes from "./routes/timeline.routes";
import connectMongoDB from "./db/connectMongoDB";
import cookieParser from "cookie-parser";
import { InitializeBroker } from "./services/broker.services";

export const ExpressApp = async () => {

  const app = express();

  app.use(express.json()); // to parse req.json , limit should not be to big to prevent DOS
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  await InitializeBroker();

  app.use("/", feedRoutes);
  await connectMongoDB();

  return app;
};
