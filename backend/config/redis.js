import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.redis_url || "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

await redisClient.connect();

export default redisClient;
