import fastify from "fastify";

export const app = fastify({
  logger: process.env.NODE_ENV !== "production",
});

app.get("/ping", async (request, reply) => {
  return "pong\n";
});

app.get("/", async (request, reply) => {
  const token = await reply.generateCsrf();
  return { token };
});
