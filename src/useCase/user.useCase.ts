import { type UserCreate } from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";
import * as argon2 from "argon2";

export class UserUseCase {
  private userRepository = new UserRepositoryPrisma();

  constructor() {
    this.userRepository = new UserRepositoryPrisma();
  }

  async create(data: UserCreate): Promise<{ id: string }> {
    // Verificar se o usuário já existe
    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists !== null) {
      throw new Error("User already exists");
    }
    // Se o provedor for "Email", garantir que a senha seja fornecida
    if (data.provider === "Email" && !data.password) {
      throw new Error("Password is required for email provider");
    }

    // Criptografar a senha, se fornecida
    if (data.password) {
      data.password = await this.userRepository.hash(data.password);
    }

    // Criar o usuário
    const { id } = await this.userRepository.create(data);

    return {
      id,
    };
  }
}
