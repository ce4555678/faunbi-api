import { type User } from "@prisma/client";
import { prisma } from "../database/prisma";
import {
  UserAnuncio,
  type UserCreate,
  type UserInterface,
  type UserUpdate,
} from "../interfaces/user.interface";
import * as argon2 from "argon2";

class UserRepositoryPrisma implements UserInterface {
  async update(data: UserUpdate): Promise<null> {
    let dataDb: UserUpdate = {
      id: data.id,
    };
    if (data.avatar) dataDb.avatar = data.avatar;
    if (data.emailVerified) dataDb.emailVerified = data.emailVerified;
    if (data.password) dataDb.password = data.password;
    if (data.block) dataDb.block = data.block;
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: dataDb,
    });
    return null;
  }

  async create(data: UserCreate): Promise<{ id: string }> {
    let { id } = await prisma.user.create({
      data: {
        email: data.email,
        emailVerified: data.emailVerified,
        avatar: data.avatar,
        name: data.name,
        provider: data.provider,
        password: data.password,
        role: "User",
      },
    });
    return { id };
  }

  async delete(id: string): Promise<null> {
    await prisma.user.delete({
      where: {
        id,
      },
    });
    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return result || null;
  }

  async findByEmailAnuncio(email: string): Promise<UserAnuncio | null> {
    const result = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        anuncio: true,
      },
    });

    return result || null;
  }

  async hash(password: string): Promise<string> {
    const hashPwd = await argon2.hash(password);

    return hashPwd;
  }
}

export { UserRepositoryPrisma };
