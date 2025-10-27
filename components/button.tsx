"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  const { pending } = useFormStatus(); // 부모 폼에 연결된 서버 액션의 상태정보를 가져옴.

  return (
    <button
      disabled={pending}
      className="font-semibold primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {pending ? "처리중..." : text}
    </button>
  );
}
