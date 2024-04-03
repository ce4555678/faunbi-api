import fastifyHelmet from "@fastify/helmet";
import { app } from "./main";
import fastifyCookie, { type FastifyCookieOptions } from "@fastify/cookie";
import { FastifyInstance } from "fastify";
import fastifyCsrfProtection from "@fastify/csrf-protection";
import fastifySession from "@fastify/session";
import RedisStore from "connect-redis";
import redis from "../database/redis";
import authRoute from "../routes/auth.route";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const redisStore = new RedisStore({
  client: redis,
  prefix: "session:",
});

export const startServer = async () => {
  const PORT = process.env.NODE_ENV == "production" ? 3000 : 8787;
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
    cookieOpts: {
      signed: true,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV == "production",
    },
  });
  await app.register(fastifySwagger, {
    swagger: {
      info: {
        title: "Api Faunbi",
        description: "Api Faunbi para plataforma",
        version: "0.1.0",
      },
    },
  });
  await app.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
  });
  await app.register(authRoute, { prefix: "/auth" });
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
