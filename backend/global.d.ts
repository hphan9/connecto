export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv {
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
