import { type FastifyInstance } from "fastify/types/instance";
import { AnuncioUseCase } from "../useCase/anuncio.useCase";
import { findOneAnuncioSchema } from "../schemas/anuncio.schema";

const anuncioRoute = async (app: FastifyInstance) => {
  const anuncioUseCase = new AnuncioUseCase();

  app.route<{
    Params: {
      id: string;
    };
  }>({
    url: "/:id",
    method: "GET",
    schema: findOneAnuncioSchema,
    handler: async (req, reply) => {
      try {
        const id = req.params.id;
        const anuncio = await anuncioUseCase.findOne(id)
        reply.send({
          id: anuncio.id,
          title: anuncio.title,
          description: anuncio.description,
          image: anuncio.image,
          slide: anuncio.slide,
          address: anuncio.address,
          verified: anuncio.verified,
          openingHours: anuncio.openingHours,
          contacts: anuncio.contacts,
          networks: anuncio.networks,
          price: anuncio.price,
          certificates: anuncio.certificates,
          createdAt: anuncio.createdAt,
          updatedAt: anuncio.updatedAt,
        });

      } catch (error: any) {
        switch (error.message) {
          case "ad not found":
            reply.status(404);
            reply.send({
              error: {
                message: "Ad not found",
              },
            });
            break;
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
};

export default anuncioRoute;
