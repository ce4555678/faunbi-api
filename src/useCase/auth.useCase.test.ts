import { expect, test } from "vitest";
import { AuthUseCase } from "./auth.useCase";

const authUseCase = new AuthUseCase();

test("auth user", async () => {
  expect(
    await authUseCase.login({
      email: "oi1@gmail.com",
      password: "12345678",
    }),
  ).eq({
    user: {
      id: "clufttc2a0001i55l9x1x92r1",
      name: "Carlos Ricardo",
      avatar: null,
      role: "User",
    },
    anuncio: {},
  });
});
