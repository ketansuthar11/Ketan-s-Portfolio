import redis, {
    connectRedis,
} from "../config/redis.js";

export const getCache = async <T>(
    key: string
): Promise<T | null> => {
    await connectRedis();

    const value = await redis.get(key);

    if (!value) {
        return null;
    }

    return JSON.parse(value) as T;
};

export const setCache = async <T>(
    key: string,
    value: T,
    ttl = 300
) => {
    await connectRedis();

    await redis.set(
        key,
        JSON.stringify(value),
        {
            EX: ttl,
        }
    );
};

export const deleteCache = async (
    key: string
) => {
    await connectRedis();

    await redis.del(key);
};