import mongoose from "mongoose";

interface AuthUser {
  username: string;
  _id: string;
  email: string;
}
export {};
// todo check the namespace again
declare global {
  namespace NodeJS {
    interface ProcessEnv {
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
    interface Request {
      user: AuthUser;
    }
  }
}
