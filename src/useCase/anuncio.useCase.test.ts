import { expect, test } from "vitest";
import { AnuncioUseCase } from "./anuncio.useCase";

const anuncioUseCase = new AnuncioUseCase();

test("Anuncio find one", async () => {
  expect(await anuncioUseCase.findOne("dgfgffdgd"));
});
