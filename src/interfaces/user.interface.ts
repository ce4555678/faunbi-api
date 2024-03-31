import { Anuncio, type User } from "@prisma/client";

export interface UserUpdate {
  id: string;
  emailVerified?: boolean;
  password?: string;
  avatar?: string;
  block?: boolean;
}

export interface UserAnuncio extends User {
  anuncio: Anuncio | null | undefined;
}
export interface UserCreate {
  name: string;
  email: string;
  password?: string;
  emailVerified?: boolean;
  avatar?: string;
  provider: "Email" | "Google";
  role: "User" | "Anunciante" | "Moderator" | "Admin";
  terms?: boolean;
}

export interface UserInterface {
  create(data: UserCreate): Promise<{ id: string }>;
  update(data: UserUpdate): Promise<null>;
  delete(id: string): Promise<null>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailAnuncio(email: string): Promise<UserAnuncio | null>;
}
