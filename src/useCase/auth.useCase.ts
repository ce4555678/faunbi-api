import { type $Enums } from "@prisma/client";
import { type AuthEmail } from "../interfaces/auth.interface";
import { AuthRepository } from "../repositories/auth.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";

type SessionUser = {
  user: {
    id: string;
    name: string;
    avatar: string | undefined;
    role: $Enums.Role;
  };
  anuncio?: {
    id: string;
    title: string;
    image?: string;
  };
};

export class AuthUseCase {
  private userRepository = new UserRepositoryPrisma();
  private authRepository = new AuthRepository();

  constructor() {
    this.userRepository = new UserRepositoryPrisma();
    this.authRepository = new AuthRepository();
  }

  async login(data: AuthEmail) {
    const userExists = await this.userRepository.findByEmailAnuncio(data.email);

    if (userExists == null) {
      throw new Error("User does not exist");
    }

    if (userExists.provider !== "Email") {
      throw new Error("already exists with a different provider");
    }

    if (!userExists.password) {
      throw new Error("invalid credentials");
    }

    const validPwd = await this.authRepository.verifyPassword({
      password: data.password,
      hash: userExists.password,
    });

    if (validPwd == false) {
      throw new Error("invalid credentials");
    }
    let session: SessionUser = {
      user: {
        id: userExists.id,
        name: userExists.name,
        avatar: userExists.avatar || undefined,
        role: userExists.role,
      },
      anuncio: undefined,
    };

    if (userExists.anuncio) {
      session = {
        ...session,
        anuncio: {
          id: userExists.anuncio.id,
          title: userExists.anuncio.title,
          image: userExists.anuncio.image || undefined,
        },
      };
    }

    return session;
  }
}
