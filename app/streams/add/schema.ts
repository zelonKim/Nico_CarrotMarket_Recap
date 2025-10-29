import { z } from "zod";

export const streamSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
});
