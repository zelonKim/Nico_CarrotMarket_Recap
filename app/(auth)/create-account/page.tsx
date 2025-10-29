"use client";

import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import Button from "@/components/button";
import Link from "next/link";

export default function CreateAccount() {
  const [state, dispatch] = useFormState(createAccount, null);

  return (
    <div className="flex flex-col max-w-screen-md gap-10 py-8 px-6 ">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">당신의 프로필을 작성해주세요.</h2>
      </div>

      <form action={dispatch} className="flex flex-col gap-3 text-white">
        <Input
          name="username"
          type="text"
          placeholder="유저 이름"
          required={true}
          errors={state?.fieldErrors.username}
          minLength={2}
          maxLength={20}
        />
        <Input
          name="email"
          type="email"
          placeholder="이메일"
          required={true}
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="비밀번호"
          required={true}
          errors={state?.fieldErrors.password}
        />
        <Input
          name="confirm_password"
          type="password"
          placeholder="비밀번호 확인"
          required={true}
          errors={state?.fieldErrors.confirm_password}
        />

        <Button text="가입하기" />
      </form>
      <SocialLogin />
      <span className="text-center *:text-white -mt-2">
        이미 캐럿마켓 회원이신가요?{" "}
        <Link href="/login" className="hover:underline">
          로그인
        </Link>
      </span>
    </div>
  );
}
