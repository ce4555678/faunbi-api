import { GoogleRepository } from "../repositories/Google.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";

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

    const { access_token, id_token } =
      await this.googleRepository.callback(code);
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
      };
    }

    if (userExists.anuncio) {
      return {
        user: {
          id: userExists.id,
          name: userExists.name,
          avatar: userExists.avatar || undefined,
          role: userExists.role,
        },
        anuncio: {
          id: userExists.anuncio.id,
          title: userExists.anuncio.title,
          image: userExists.anuncio.image || undefined,
        },
      };
    }

    if (userExists.provider !== "Google") {
      throw new Error("already exists with a different provider");
    }
    return {
      user: {
        id: userExists.id,
        name: userExists.name,
        avatar: userExists.avatar,
        role: userExists.role,
      },
    };
  }
}
