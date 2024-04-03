import { type Prisma } from "@prisma/client";

type Contacts = { type: "whatsApp" | "telegram" | "tel"; phone: number } | [];
type OpeningHours =
  | {
      day:
        | "Segunda"
        | "Terça"
        | "Quarta"
        | "Quinta"
        | "Sexta"
        | "Sabádo"
        | "Domingo";
      abre: string;
      fecha: string;
    }[]
  | [];

type Networks =
  | {
      network: "YouTube" | "Facebook" | "Instagram" | "X" | "TikTok" | "Site";
      url: string;
    }[]
  | [];

type Certificates =
  | {
      content: string;
      url: string;
    }[]
  | [];

export type AnuncioFindOne = {
  id: string;
  title: string;
  description: string;
  listingPoints: number | null;
  pointsExpiration: Date | null;
  image: string | null;
  openingHours: Prisma.JsonValue;
  verified: boolean;
  active: boolean;
  certificates: Prisma.JsonValue;
  slide: string[];
  price: number | null;
  address: string;
  authorId: string;
  categoryId: string;
  networks: Prisma.JsonValue;
  contacts: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
};

export interface UpdateAnuncio {
  address?: string;
  categoryId?: string;
  description?: string;
  title?: string;
  networks?: Networks;
  openingHours?: OpeningHours;
  image?: string;
  price?: number;
  slide?: string[];
  contacts?: Contacts;
  certificates?: Certificates;
}

export interface CreateAnuncio {
  address: string;
  contacts: Contacts;
  openingHours: OpeningHours;
  networks?: Networks;
  description: string;
  title: string;
  authorId: string;
  categoryId: string;
  image?: string;
}
export interface AnuncioInterface {
  create(data: CreateAnuncio): Promise<{ id: string }>;
  update(id: string, data: UpdateAnuncio): Promise<null>;
  findOne(id: string): Promise<AnuncioFindOne | null>;
}
