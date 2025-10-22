"use server";
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


function checkUsername(username: string) {
  return !username.includes("fuck");
}

function checkPassword({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) {
  return password === confirm_password;
}


// const checkUniqueUsername = async (username: string) => {
//   const user = await db.user.findUnique({ 
//     where: {
//       username 
//     },
//     select: {
//       id: true
//     }
//   })
//   return !Boolean(user) 
// }


// const checkUniqueEmail = async(email: string) => {
//   const user = await db.user.findUnique({
//     where: {
//       email
//     },
//     select: {
//       id: true
//     }
//   })
//   return !Boolean(user)
// }


const formSchema = z
  .object({
    // 유효성 검사 스키마(조건)를 정의함.
    username: z
      .string({
        invalid_type_error: "유저 이름은 문자열이어야 합니다.",
        required_error: "유저 이름은 필수입니다.",
      })
      .min(2, "유저 이름이 너무 짧습니다.")
      .max(30, "유저 이름이 너무 깁니다.")
      .toLowerCase() // 입력된 문자를 모두 소문자로 바꿔줌.
      .trim() // 입력된 공백을 제거해줌.
      // .transform((username) => `${username}님`) // 주어진 함수를 통해 입력된 데이터를 변환해줌.
      .refine(checkUsername, "No swear allowed"), // 주어진 함수가 false를 리턴하면 해당 에러메시지를 보여줌.
      //.refine(checkUniqueUsername, "해당 유저 이름은 이미 사용중입니다."),
   
      email: z.string()
            .email()
            .toLowerCase(),
             //.refine(checkUniqueEmail, "해당 이메일은 이미 사용중입니다."),
    
      password: z
      .string({
        required_error: "비밀번호는 필수입니다.",
      }),
      //.min(PASSWORD_MIN_LENGTH)
      //.regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string()
                      //.min(10),
  })
  .superRefine(async({username}, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username
      },
      select: {
        id: true
      }
    })
    if(user) {
      ctx.addIssue({
        code: 'custom',
        message: "해당 유저 이름은 이미 사용중입니다.",
        path: ["username"], // 에러메시지가 표시될 필드의 name을 지정함.
        fatal: true,
      })
      return z.NEVER; // 컨텍스트(ctx)에 치명적 이슈(fatal Issue)가 있을 경우, 이후에 나오는 refine을 실행하지 않음.
    }
  })
  .superRefine(async({email}, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email
      },
      select: {
        id: true
      }
    })
    if(user) {
      ctx.addIssue({
        code: 'custom',
        message: "해당 이메일은 이미 사용중입니다.",
        path: ["email"], // 에러메시지가 표시될 필드의 name을 지정함.
        fatal: true,
      })
      return z.NEVER; // 컨텍스트(ctx)에 치명적 이슈(fatal Issue)가 있을 경우, 이후에 나오는 refine을 실행하지 않음.
    }
  })
  .refine(checkPassword, {
    message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    path: ["confirm_password"], 
  })




/////////////////////////////



export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = await formSchema.safeParseAsync(data); // 해당 데이터에 유효성 검사 스키마를 적용함.
  if (!result.success) {
    // 유효성 검사를 통과하지 못했을 경우
    return result.error.flatten();
  } else {

    const hashedPassword = await bcrypt.hash(result.data.password, 12)

    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword
      },
      select: {
        id: true,
      }
    })
    redirect("/")


  } 
}
