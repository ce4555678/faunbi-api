import { type FastifyInstance } from "fastify/types/instance";
import { UserUseCase } from "../useCase/user.useCase";
import { z } from "zod";
import { validateUserCreate } from "../validators/user.validator";
import { type $Enums } from "@prisma/client";
import { GoogleUseCase } from "../useCase/google.useCase";
import { AuthUseCase } from "../useCase/auth.useCase";
import { validateLogin } from "../validators/auth.validator";
import {
  callbackGoogleSchema,
  loginGoogleSchema,
  loginSchema,
  logoutSchema,
  signupSchema,
} from "../schemas/auth.schema";

const authRoute = async (app: FastifyInstance) => {
  const userUseCase = new UserUseCase();
  const googleUseCase = new GoogleUseCase();
  const authUseCase = new AuthUseCase();

  // Signup
  app.route({
    url: "/signup",
    method: "POST",
    schema: signupSchema,
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

  // Login Google
  app.route({
    url: "/login/google",
    method: "POST",
    schema: loginGoogleSchema,
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

  // Callback Google
  app.route({
    url: "/callback/google",
    method: "GET",
    schema: callbackGoogleSchema,
    handler: async (req, reply) => {
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

        const session = await googleUseCase.callback(state, storedState, code);

        if (session.anuncio) {
          req.session.anuncio = {
            id: session.anuncio.id,
            title: session.anuncio.title,
            image: session.anuncio.image,
          };
        }

        if (session.user) {
          req.session.user = {
            id: session.user.id,
            name: session.user.name,
            avatar: session.user.avatar || undefined,
            role: session.user.role as $Enums.Role,
          };
        }

        reply.send("");
      } catch (error: any) {
        switch (error.message) {
          case "invalid request":
            reply.status(401);
            reply.send({
              error: {
                message: "invalid request",
              },
            });
            break;

          case "already exists with a different provider":
            reply.status(401);
            reply.send({
              error: {
                message: "already exists with a different provider",
              },
            });
            break;
          default:
            reply.status(500);
            reply.send({
              error: {
                message: "Server error",
              },
            });
            break;
        }
      }
    },
  });

  // Login
  app.route({
    url: "/login",
    method: "POST",
    schema: loginSchema,
    onRequest: app.csrfProtection,
    handler: async (req, reply) => {
      try {
        const { email, password } = await validateLogin(req.body);
        const session = await authUseCase.login({ email, password });

        if (session.anuncio) {
          req.session.anuncio = {
            id: session.anuncio.id,
            title: session.anuncio.title,
            image: session.anuncio.image,
          };
        }

        if (session.user) {
          req.session.user = {
            id: session.user.id,
            name: session.user.name,
            avatar: session.user.avatar || undefined,
            role: session.user.role as $Enums.Role,
          };
        }

        return reply.send("");
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          reply.status(400);
          return reply.send({
            error: {
              message: "Bad request",
            },
          });
        }

        switch (error.message) {
          case "User does not exist":
            reply.status(401);
            reply.send({
              error: {
                message: "User does not exist",
              },
            });
            break;

          case "already exists with a different provider":
            reply.status(401);
            reply.send({
              error: {
                message: "already exists with a different provider",
              },
            });
            break;

          case "invalid credentials":
            reply.status(401);
            reply.send({
              error: {
                message: "invalid credentials",
              },
            });
            break;
          default:
            reply.status(500);
            reply.send({
              error: {
                message: "Server error",
              },
            });
            break;
        }
      }
    },
  });

  // Logout
  app.route({
    url: "/logout",
    method: "POST",
    schema: logoutSchema,
    onRequest: app.csrfProtection,
    handler: async (req, reply) => {
      try {
        await req.session.destroy();

        reply.send("");
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
};

export default authRoute;
