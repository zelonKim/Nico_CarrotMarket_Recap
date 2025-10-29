"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { smsLogin } from "./actions";

const initialState = {
  token: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsLogin, initialState);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS 로그인</h1>
        <h2 className="text-xl">핸드폰 번호로 간편하게 로그인 해보세요</h2>
      </div>

      <form action={dispatch} className="flex flex-col gap-3">
        {state.token ? (
          <Input
            name="token"
            type="number"
            placeholder="인증 코드"
            required
            key="token"
            errors={state.error?.formErrors}
            //min={100000}
            //max={999999}
          />
        ) : (
          <Input
            name="phone"
            type="text"
            placeholder="핸드폰 번호"
            errors={state.error?.formErrors}
            required
            key="phone"
          />
        )}
        <Button text={state.token ? "인증하기" : "SMS로 토큰 보내기"} />
      </form>
    </div>
  );
}
