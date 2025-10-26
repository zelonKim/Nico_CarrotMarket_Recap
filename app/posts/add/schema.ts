import { z } from "zod";

export const postSchema = z.object({
  title: z.string({
    required_error: "제목은 필수입니다.",
  }),
  description: z.string().optional(),
});

export type PostType = z.infer<typeof postSchema>;
