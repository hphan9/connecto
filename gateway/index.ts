import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
//proxy will redirect request coming to api gateway based on endpoint
import proxy from 'express-http-proxy';

dotenv.config();
const app= express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', proxy(`http://${process.env.AUTH_SERVICE}`));
app.use('/api/posts', proxy(`http://${process.env.POST_SERVICE}`));
app.use('/api/timeline', proxy(`http://${process.env.TIMELINE_SERVICE}`));
app.use('/api/users', proxy(`http://${process.env.USER_SERVICE}`));

app.listen(8000,()=>{
    console.log('API Gateway is listening to Port 8000');
})