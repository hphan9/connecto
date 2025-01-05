import express from 'express';
import { authRoutes } from './routes';
import connectMongoDB from './db/connectMongoDB';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
const PORT = process.env.PORT || 8001;
const app = express();
app.use(express.json({ limit: '5mb' })); // to parse req.json , limit should not be to big to prevent DOS
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.listen(process.env.PORT, () => {
  console.log(`App is listening to ${process.env.PORT}`);
});

connectMongoDB();
