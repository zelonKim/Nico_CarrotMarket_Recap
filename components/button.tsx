"use client";

import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  const { pending } = useFormStatus(); // 부모 폼에 연결된 서버 액션의 상태정보를 가져옴.

  return (
    <button
      disabled={pending}
      className="!text-white flex justify-center items-center font-semibold bg-green-500 hover:bg-green-600  rounded-md h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {pending ? (
        <ArrowPathIcon className="size-5 animate-spin text-center text-white" />
      ) : (
        text
      )}
    </button>
  );
}
