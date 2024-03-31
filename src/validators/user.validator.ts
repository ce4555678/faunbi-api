import { z } from "zod";

export const validateUserCreate = async (data: unknown) => {
  const schema = z.object({
    email: z
      .string()
      .email()
      .max(50)
      .refine((value) => value.trimStart().trimEnd().toLowerCase()),
    name: z
      .string()
      .min(2)
      .max(50)
      .refine((value) => value.trimStart().trimEnd().toLowerCase()),
    password: z.string().min(8).max(50).optional(),
    terms: z.boolean().refine((value) => value == true),
  });

  const valid = await schema.parseAsync(data);

  return valid;
};
