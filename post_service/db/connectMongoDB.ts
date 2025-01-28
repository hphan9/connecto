import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "localhost:27817");
    console.log(`Connected to Mongodb`);
  } catch (error: unknown) {
    console.error(`Error connection to mongoDB:${error}`);
    process.exit(1);
  }
};

export default connectMongoDB;
