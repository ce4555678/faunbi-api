import { $Enums } from "@prisma/client";
import type { FastifyReply } from "fastify/types/reply";
import type { FastifyRequest } from "fastify/types/request";

declare module "fastify" {
  interface Session {
    user?: {
      id: string;
      name: string;
      avatar?: string;
      role: $Enums.Role;
    };
    anuncio?: {
      id: string;
      title: string;
      image?: string;
    };
  }
}

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  if (req.session.user == undefined || req.session.user == null) {
    return reply.status(401).send({
      message: "you do not have permission",
    });
  }
}
