"use client";

import FormInput from "@/components/input";
import SocialLogin from "@/components/social-login";

import { useFormState } from "react-dom";
import { login } from "./actions";

import Button from "@/components/button";
import Link from "next/link";

export default function LogIn() {
  const [state, actionTrigger] = useFormState(login, {
    errors: ["First Server Action Test"],
  } as unknown); // 인수로 원하는 서버액션과 초기 상태값을 전달함.
  // 첫번째 원소에는 해당 서버액션의 리턴값이 담김.
  // 두번째 원소에는 해당 서버액션을 호출하는 트리거가 담김.

  // 타입 가드 함수
  const getFieldErrors = (fieldName: string): string[] => {
    if (state && typeof state === "object" && "fieldErrors" in state) {
      const fieldErrors = (state as { fieldErrors?: Record<string, string[]> })
        .fieldErrors;
      return fieldErrors?.[fieldName] || [];
    }
    return [];
  };

  /*
  // API 라우트 핸들러 
  const onClick = async () => {

    const response = await fetch("/www/users", { // 해당 URL엔드포인트로 요청을 보냄.
      method: "POST",
      body: JSON.stringify({
        username: "zelon",
        password: "1234",
      }),
    });

    console.log(await response.json()); // {username: 'zelon', password: '1234'}
  };
*/
  console.log(state);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">가깝고 따뜻한 당신의 근처를 만들어요.</h2>
      </div>
      <form action={actionTrigger} className="flex flex-col gap-3">
        {/* action속성을 통해 서버 액션과 폼을 연결함. */}
        <FormInput
          name="email" // 서버 액션 FormData의 키를 설정함.
          type="email"
          placeholder="이메일"
          required
          errors={getFieldErrors("email")}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          errors={getFieldErrors("password")}
        />
        <Button text="로그인" />
      </form>

      {/* <span onClick={onClick}>
        <FormButton loading={false} text="로그인" />
      </span> */}
      <SocialLogin />
      <span className="text-center *:text-white -mt-2">
        캐럿마켓에 처음이신가요?{" "}
        <Link href="/create-account" className="hover:underline">
          회원가입
        </Link>
      </span>
    </div>
  );
}
