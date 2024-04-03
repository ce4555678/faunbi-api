export const signupSchema = {
  tags: ["Autenticação"],
  description: "Processo de registro de usuários.",
  body: {
    type: "object",
    properties: {
      email: { type: "string", description: "E-mail do usuário." },
      name: { type: "string", description: "Nome do usuário." },
      password: { type: "string", description: "Senha do usuário." },
      terms: {
        type: "boolean",
        description: "Indicação de aceitação dos termos.",
      },
    },
    required: ["email", "name", "password", "terms"],
  },
  response: {
    201: {
      type: "string",
      description: "Sucesso ao criar uma conta.",
    },
    409: {
      type: "object",
      properties: {
        error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
      description:
        "Conflito ao tentar criar uma conta com e-mail já existente.",
    },
    400: {
      type: "object",
      properties: {
        error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
      description: "Requisição inválida.",
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
      description: "Erro interno do servidor.",
    },
  },
};

export const loginSchema = {
  tags: ["Autenticação"],
  description: "Processo de login de usuários.",
  body: {
    type: "object",
    properties: {
      email: { type: "string", description: "E-mail do usuário." },
      password: { type: "string", description: "Senha do usuário." },
    },
    required: ["email", "password"],
  },
  response: {
    200: {
      type: "string",
      description: "Sucesso ao realizar o login.",
    },
    400: {
      type: "object",
      properties: {
        error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
      description: "Requisição inválida.",
    },
    401: {
      type: "object",
      properties: {
        error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
      description: "Credenciais inválidas.",
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
      description: "Erro interno do servidor.",
    },
  },
};

export const logoutSchema = {
  tags: ["Autenticação"],
  description: "Processo de logout de usuários.",
  response: {
    200: {
      type: "string",
      description: "Sucesso ao fazer logout.",
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
      description: "Erro interno do servidor.",
    },
  },
};

export const loginGoogleSchema = {
  tags: ["Autenticação"],
  description: "Processo de login com Google.",
  schema: {
    body: {
      type: "object",
      properties: {},
      required: [],
    },
    response: {
      200: {
        type: "object",
        properties: {},
      },
      500: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
      },
    },
  },
};

export const callbackGoogleSchema = {
  tags: ["Autenticação"],
  description: "Callback de autenticação com Google.",
  querystring: {
    type: "object",
    properties: {
      state: {
        type: "string",
        description: "Estado fornecido durante a autenticação.",
      },
      code: {
        type: "string",
        description: "Código de autorização recebido do Google.",
      },
    },
    required: ["state", "code"],
  },
  response: {
    200: {
      type: "string",
      description: "Sucesso na autenticação com o Google.",
    },
    401: {
      type: "object",
      properties: {
        error: { type: "object", properties: { message: { type: "string" } } },
      },
      description: "Não autorizado.",
    },
    500: {
      type: "object",
      properties: {
        error: { type: "object", properties: { message: { type: "string" } } },
      },
      description: "Erro interno do servidor.",
    },
  },
};
