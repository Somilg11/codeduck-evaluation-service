import Redis from 'ioredis';

const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null, // Disable built-in retry mechanism
};

export const redis = new Redis(redisConfig);

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export const createNewRedisConnection = () => {
    const newRedis = new Redis(redisConfig);
    newRedis.on('connect', () => {
        console.log('Created new Redis connection');
    });
    newRedis.on('error', (err) => {
        console.error('New Redis connection error:', err);
    });
    return newRedis;
};