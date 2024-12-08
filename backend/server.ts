import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import connectMongoDB from "./db/connectMongoDB";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); // to parse req.json
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`server is up and running on port ${PORT}`);
  connectMongoDB();
});

export default app;
