import express from 'express';
import cors from 'cors';

//proxy will redirect request coming to api gateway based on endpoint
import proxy from 'express-http-proxy';

const app= express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', proxy('http://localhost:8001'));
app.use('/api/posts', proxy('http://localhost:8002'));
app.use('/api/timeline', proxy('http://localhost:8003'));
app.use('/api/users', proxy('http://localhost:8004'));

app.listen(8000,()=>{
    console.log('API Gateway is listening to Port 8000');
})