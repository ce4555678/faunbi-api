import { AnuncioRepository } from "../repositories/anuncio.repository";

export class AnuncioUseCase {
  private anuncioRepository = new AnuncioRepository();

  constructor() {
    this.anuncioRepository = new AnuncioRepository();
  }

  async findOne(id: string) {
    const anuncioCache = await this.anuncioRepository.FindOneCache(id);

    if (anuncioCache !== null) return JSON.parse(`${anuncioCache}`);

    const anuncio = await this.anuncioRepository.findOne(id);

    if (anuncio !== null) {
      await this.anuncioRepository.insertOneCache(id, anuncio);
      return anuncio;
    }

    throw new Error("ad not found");
  }
}
