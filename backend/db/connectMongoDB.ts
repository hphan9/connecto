import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`Connectted to Mongodb`);
    }
  } catch (error: unknown) {
    console.error(`Error connection to mongoDB:${error}`);
    process.exit(1);
  }
};

export default connectMongoDB;
