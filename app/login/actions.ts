"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
// 서버 액션

import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, "비밀번호는 최소 4자리 이상이어야 합니다.")
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

/////////////////////

export const login = async (prevState: any, formData: FormData) => {
  // 매개변수로 이전 상태값, 연결된 폼에 입력된 데이터가 전달됨.
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  console.log(prevState);
  // await new Promise((resolve) => setTimeout(resolve, 5000)); // 5초동안 대기(pending)상태로 만듦.
  console.log(formData.get("email"));
  console.log(formData.get("password"));
  console.log("유저가 로그인 하였습니다.");

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }

  return {
    errors: ["비밀번호가 틀렸습니다.", "비밀번호가 너무 짧습니다."],
  };
};
