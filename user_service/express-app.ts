import express from "express";
import userRoutes from "./routes/user.routes";
import connectMongoDB from "./db/connectMongoDB";
import cookieParser from "cookie-parser";

export const ExpressApp = async () => {

  const app = express();

  app.use(express.json()); // to parse req.json , limit should not be to big to prevent DOS
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use("/user", userRoutes);
  await connectMongoDB();

  return app;
};
