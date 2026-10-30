
import "dotenv/config";
import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error("REDIS_URL is not configured");
}

const redis = createClient({ url: redisUrl });

redis.on("error", (error) => {
    console.error("Redis error:", error);
});

try {
    await redis.connect();

    // WARNING: Deletes every key in the selected Redis database.
    await redis.flushDb();

    console.log("Redis database cache cleared successfully!");
} catch (error) {
    console.error("Failed to clear Redis:", error);
    process.exitCode = 1;
} finally {
    if (redis.isOpen) {
        await redis.quit();
    }
}
