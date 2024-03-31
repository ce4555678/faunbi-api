import { z } from "zod";

export const validateLogin = async (data: unknown) => {
  const schema = z.object({
    email: z
      .string()
      .email()
      .max(50)
      .refine((value) => value.trimStart().trimEnd().toLowerCase()),
    password: z.string().min(8).max(50),
  });

  const valid = await schema.parseAsync(data);

  return valid;
};
