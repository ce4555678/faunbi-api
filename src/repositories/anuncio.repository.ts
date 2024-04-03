import { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma";
import {
  type UpdateAnuncio,
  type AnuncioInterface,
  type CreateAnuncio,
  type AnuncioFindOne,
} from "../interfaces/anuncio.interface";

export class AnuncioRepository implements AnuncioInterface {
  async create(data: CreateAnuncio) {
    const contacts = data.contacts as Prisma.JsonArray;
    const networks = data.networks as Prisma.JsonArray;
    const openingHours = data.openingHours as Prisma.JsonArray;

    const { id } = await prisma.anuncio.create({
      data: {
        address: data.address,
        description: data.description,
        title: data.title,
        openingHours,
        contacts,
        networks,
        authorId: data.authorId,
        categoryId: data.categoryId,
        image: data.image,
      },
    });

    return { id };
  }

  async update(id: string, data: UpdateAnuncio): Promise<null> {
    await prisma.anuncio.update({
      where: {
        id,
      },
      data: {
        address: data.address,
        categoryId: data.categoryId,
        description: data.description,
        title: data.title,
        networks: data.networks
          ? (data.networks as Prisma.JsonArray)
          : undefined,
        openingHours: data.openingHours
          ? (data.openingHours as Prisma.JsonArray)
          : undefined,
        image: data.image,
        price: data.price,
        slide: data.slide,
        contacts: data.contacts
          ? (data.contacts as Prisma.JsonArray)
          : undefined,
        certificates: data.contacts
          ? (data.contacts as Prisma.JsonArray)
          : undefined,
      },
    });

    return null;
  }

  async findOne(id: string): Promise<AnuncioFindOne | null> {
    const anuncio = await prisma.anuncio.findUnique({
      where: {
        id,
      },
    });

    return anuncio || null;
  }
}
