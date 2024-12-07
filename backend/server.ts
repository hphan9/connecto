import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import connectMongoDB from "./db/connectMongoDB";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`server is up and running on port ${PORT}`);
  connectMongoDB();
});

export default app;
