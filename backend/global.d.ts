export {};
// todo check the namespace again 
declare global {
  namespace NodeJS {
   export interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;
      MONGO_URI: string;
      JWT_SECRET: string;
    }
  }
  namespace Express {
   export interface Request {
     user: any;
   }
 }
}