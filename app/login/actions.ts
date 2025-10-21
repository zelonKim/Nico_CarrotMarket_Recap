"use server"; // 서버 액션
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt"
import getSession from "@/lib/session";
import { redirect } from "next/navigation";


const checkEmailExists = async(email: string) => {
  const user = await db.user.findUnique({
    where: {
      email
    },
    select: {
      id: true
    }
  })
  return Boolean(user)
}


const formSchema = z.object({
  email: z.string().email().toLowerCase().refine(checkEmailExists, "존재하지 않는 이메일 입니다."),
  password: z.string()
    //.min(PASSWORD_MIN_LENGTH, "비밀번호는 최소 4자리 이상이어야 합니다.")
    //.regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

/////////////////////

export const login = async (prevState: any, formData: FormData) => {
  // 매개변수로 이전 상태값, 연결된 폼에 입력된 데이터가 전달됨.
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  // console.log(prevState);
  // await new Promise((resolve) => setTimeout(resolve, 5000)); // 5초동안 대기(pending)상태로 만듦.
  // console.log(formData.get("email"));
  // console.log(formData.get("password"));
  // console.log("유저가 로그인 하였습니다.");

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {

    const user = await db.user.findUnique({
      where: {
        email: result.data.email
      },
      select: {
        id: true,
        password: true
      }
    })

    const ok = await bcrypt.compare(result.data.password, user!.password ?? "aaaa")

    if(ok) { 
      // 로그인 과정
      const session = await getSession()
      session.id = user!.id // 세션에 유저 아이디를 기록함.
      await session.save()

      redirect("/profile")
    } else {
      return {
        fieldErrors: {
          email: [],
          password: ["틀린 비밀번호 입니다."]
        }
      }
    }
  }
};
