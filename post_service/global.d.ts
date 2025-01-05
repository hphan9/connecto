import mongoose from "mongoose";
import User, { IUser } from "./models/user.model";

export {};
// todo check the namespace again
declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;
      MONGO_URI: string;
      JWT_SECRET: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
    }
  }
  namespace Express {
    export interface Request {
      user: IUser;
    }
  }
}
