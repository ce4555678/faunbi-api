import fastifyHelmet from "@fastify/helmet";
import { app } from "./main";
import fastifyCookie, { type FastifyCookieOptions } from "@fastify/cookie";
import { FastifyInstance } from "fastify";
import fastifyCsrfProtection from "@fastify/csrf-protection";
import fastifySession from "@fastify/session";
import RedisStore from "connect-redis";
import redis from "../database/redis";
import authRoute from "../routes/auth.route";

const redisStore = new RedisStore({
  client: redis,
  prefix: "session:",
});

export const startServer = async () => {
  await app.register(fastifyHelmet);
  await app.register(fastifyCookie, {
    secret: process.env.SECRET_COOKIE,
  } as FastifyCookieOptions);
  await app.register(fastifySession, {
    cookie: {
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      domain: process.env.DOMAIN,
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
    },
    store: redisStore,
    saveUninitialized: false,
    secret: process.env.SECRET_SESSION as string,
  });
  await app.register(fastifyCsrfProtection, {
    cookieOpts: { signed: true, httpOnly: true, sameSite: "lax" },
  });
  await app.register(authRoute, { prefix: "/auth" });
  const PORT = process.env.NODE_ENV == "production" ? 3000 : 8787;
  await startServerFastify(app, PORT, "0.0.0.0");
};

const startServerFastify = async (
  app: FastifyInstance,
  port: number,
  host: string,
) => {
  return new Promise((resolve, reject) => {
    app.listen({ port, host }, (err, address) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(`Server listening at ${address}`);
        resolve(address);
      }
    });
  });
};
