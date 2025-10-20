"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "잘못된 핸드폰 번호 형식입니다."
  ); // 핸드폰 번호가 한국 로케일 형식에 맞는지 검사함.

const tokenSchema = z.coerce.number().min(100000).max(999999); // coerce를 통해 입력받은 string타입을 number타입으로 바꿈.

interface ActionState {
  token: boolean;
}
//////////////////

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      return {
        token: true,
      };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      redirect("/");
    }
  }
  // console.log(typeof formData.get("token")); // string
  // console.log(typeof tokenSchema.parse(formData.get("token"))); // number
}
