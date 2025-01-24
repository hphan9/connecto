import redis from "redis";

const redisClient = redis.createClient({url:process.env.REDIS_URI});
await redisClient.connect();
redisClient.on('connect',()=>{console.log("Connected Redis on default port")});
export default redisClient;
