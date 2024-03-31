import { type FastifyInstance } from "fastify/types/instance";
import { UserUseCase } from "../useCase/user.useCase";
import { z } from "zod";
import { validateUserCreate } from "../validators/user.validator";
import { GoogleUseCase } from "../useCase/Google.useCase";
import { $Enums } from "@prisma/client";

const authRoute = async (app: FastifyInstance) => {
  const userUseCase = new UserUseCase();
  const googleUseCase = new GoogleUseCase();

  app.route({
    url: "/signup",
    method: "POST",
    onRequest: app.csrfProtection,
    handler: async (req, reply) => {
      try {
        const { email, name, password, terms } = await validateUserCreate(
          req.body,
        );
        await userUseCase.create({
          email,
          name,
          provider: "Email",
          password,
          role: "User",
          terms,
        });

        reply.status(201);
        return reply.send("");
      } catch (error: any) {
        if (error.message === "User already exists") {
          reply.status(409); // Conflict
          return reply.send({
            error: {
              message: "User already exists",
            },
          });
        }

        if (error instanceof z.ZodError) {
          reply.status(400);
          return reply.send({
            error: {
              message: "Bad request",
            },
          });
        }

        reply.status(500);
        return reply.send({
          error: {
            message: "Server error",
          },
        });
      }
    },
  });

  app.route({
    url: "/login/google",
    method: "POST",
    onRequest: app.csrfProtection,
    handler: async (req, reply) => {
      try {
        const state = await googleUseCase.genState();

        reply.setCookie("state_google", state, {
          path: "/",
          maxAge: 60 * 10,
          httpOnly: true,
        });

        const link = await googleUseCase.getLink(state);

        return reply.redirect(link);
      } catch (error) {
        reply.status(500);
        return reply.send({
          error: {
            message: "Server error",
          },
        });
      }
    },
  });

  app.get("/callback/google", async (req, reply) => {
    try {
      const url = new URL(
        req.url,
        process.env.NODE_ENV == "production"
          ? "https://api.faunbi.com"
          : "http://localhost:8787",
      );
      const state = url.searchParams.get("state") || "";
      const code = url.searchParams.get("code") || "";
      const storedState = req.cookies.state_google || "";

      const { user, anuncio } = await googleUseCase.callback(
        state,
        storedState,
        code,
      );

      if (anuncio) {
        req.session.anuncio = anuncio;
      }

      if (user) {
        req.session.user = {
          id: user.id,
          name: user.name,
          avatar: user.avatar || undefined,
          role: user.role as $Enums.Role,
        };
      }

      reply.send("");
    } catch (error) {
      reply.status(500);
      return reply.send({
        error: {
          message: "Server error",
        },
      });
    }
  });
};
export default authRoute;
