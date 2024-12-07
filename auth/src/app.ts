import express from 'express';
import { signUpRouter } from './routes';
import { json } from 'body-parser';

const app = express();

app.use(json());
app.use(signUpRouter);

export default app;
