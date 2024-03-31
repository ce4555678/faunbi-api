import { type $Enums } from "@prisma/client";
import { GoogleRepository } from "../repositories/google.repository";
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

export class GoogleUseCase {
  private userRepository = new UserRepositoryPrisma();
  private googleRepository = new GoogleRepository();

  constructor() {
    this.userRepository = new UserRepositoryPrisma();
    this.googleRepository = new GoogleRepository();
  }

  async getLink(state: string) {
    const link = await this.googleRepository.getLink(state);

    return link;
  }

  async genState() {
    const state = await this.googleRepository.genState();
    return state;
  }

  async callback(state: string, storedState: string, code: string) {
    if (!storedState || !state || storedState !== state) {
      throw new Error("invalid request");
    }

    const { access_token } = await this.googleRepository.callback(code);
    const { email, email_verified, name, picture } =
      await this.googleRepository.getUser(access_token);
    const userExists = await this.userRepository.findByEmailAnuncio(email);

    if (userExists == null) {
      const { id } = await this.userRepository.create({
        email,
        provider: "Google",
        name,
        role: "User",
        emailVerified: email_verified,
        avatar: picture,
      });
      return {
        user: {
          id,
          name,
          avatar: picture,
          role: "User",
        },
        anuncio: undefined,
      };
    }

    if (userExists.provider !== "Google") {
      throw new Error("already exists with a different provider");
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
      return session;
    }

    return session;
  }
}
