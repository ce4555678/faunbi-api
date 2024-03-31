import { expect, test } from "vitest";
import { UserUseCase } from "./user.useCase";

const userUseCase = new UserUseCase();

test("create user", async () => {
  expect(
    await userUseCase.create({
      email: "oi@gmail.com",
      name: "Carlos Ricardo",
      provider: "Email",
      password: "12345678",
      role: "User",
    }),
  ).toBe(null);
});
