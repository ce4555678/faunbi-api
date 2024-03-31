import Redis from "ioredis";

const url = process.env.REDIS_URL as string;

const redis =
  process.env.NODE_ENV == "production"
    ? new Redis(url, {
        family: 6,
      })
    : new Redis(url);

export default redis;
