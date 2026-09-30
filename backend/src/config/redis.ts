import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error(
        "REDIS_URL is not configured"
    );
}

const redis = createClient({url:redisUrl});

redis.on("error",(error)=>{
    console.error("Redis error",error);
});

export const connectRedis = async()=>{
    if(!redis.isOpen){
        await redis.connect();
    }
}

export default redis;