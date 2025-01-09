import { ExpressApp } from "./express-app";

import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 8002;
console.log(process.env.PORT);
export const StartServer = async () => {
  const expressApp = await ExpressApp();
  expressApp.listen(PORT, () => {
    console.log(`Timeline Sevice is listening to ${PORT}`);
  });

  process.on("uncaughtException", async (err) => {
    console.log(err);
    process.exit(1);
  });
};

StartServer().then(() => {
  console.log("TimeLine Service is up");
});
