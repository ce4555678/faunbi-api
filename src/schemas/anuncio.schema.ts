export const findOneAnuncioSchema = {
  tags: ["Anuncio"],
  params: {
    type: "object",
    properties: {
      id: { type: "string", description: "ID do anúncio" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        image: { type: ["string", "null"] },
        slide: { type: "array" },
        address: { type: "string" },
        verified: { type: "boolean" },
        openingHours: { 
          type: ["object", "null"],
          additionalProperties: true // Permitir propriedades adicionais no objeto openingHours
        },
        contacts: { 
          type: ["object", "null"],
          additionalProperties: true // Permitir propriedades adicionais no objeto contacts
        },
        networks: { 
          type: ["array", "null"]
        },
        price: { type: ["number", "null"] },
        certificates: { 
          type: ["array", "null"]
        },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
        // Adicione outras propriedades do anúncio aqui
      },
    },
    404: {
      type: "object",
      properties: {
        error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    500: {
      type: "object",
      properties: {
        error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
  },
};
