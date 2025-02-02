import { ExpressApp } from "./express-app";
import connectMongoDB from "./db/connectMongoDB";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 8002;
console.log(process.env.PORT);
export const StartServer = async () => {
  const expressApp = await ExpressApp(connectMongoDB);
  expressApp.listen(PORT, () => {
    console.log(`Post Sevice is listening to ${PORT}`);
  });

  process.on("uncaughtException", async (err) => {
    console.log(err);
    process.exit(1);
  });
};

StartServer().then(() => {
  console.log("Post Service is up");
});
