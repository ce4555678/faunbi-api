import { expect, test } from "vitest";
import { UserRepositoryPrisma } from "./user.repository";

const userRepository = new UserRepositoryPrisma();
test("create user", async () => {
  expect(
    await userRepository.create({
      email: "teste1@gmail.com",
      name: "carlos",
      provider: "Email",
      role: "User",
      password: "teste123",
    }),
  ).toBe(null);
});

test("delete user", async () => {
  expect(await userRepository.delete("clueq5tp40000nw4jy75iuief")).toBe(null);
});

test("update user", async () => {
  expect(
    await userRepository.update({
      id: "clueq5tp40000nw4jy75iuief",
      password: "testando",
    }),
  ).toBe(null);
});
