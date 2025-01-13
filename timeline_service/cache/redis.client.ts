import redis from "redis";

const redisClient = redis.createClient();
await redisClient.connect();
redisClient.on('connect',()=>{console.log("Connected Redis on default port")});
export default redisClient;
