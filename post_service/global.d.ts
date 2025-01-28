import mongoose from "mongoose";
import {Request} from 'express';
interface AuthUser {
  username: string;
  _id: string;
  email: string;
}
export {};
// todo check the namespace again
declare global {
  type CustomRequest = Request & { user?: AuthUser }
}
