"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { startStream } from "./actions";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function AddStream() {
  const [state, action] = useFormState(startStream, null);

  return (
    <div className="p-8 max-w-screen-md mx-auto">
      <Link href="/live">
        <ArrowLeftIcon className="size-8 mt-2 text-neutral-500 hover:text-neutral-600  hover:scale-110 " />
      </Link>
      <h1 className="mt-4 text-center text-neutral-900 text-xl font-semibold">
        라이브 방송 개설
      </h1>
      <form className="mt-8 flex flex-col gap-2" action={action}>
        <Input
          name="title"
          required
          placeholder="방송 제목"
          errors={state?.formErrors}
        />
        <div className="mt-1"></div>
        <Button text="개설하기" />
      </form>
    </div>
  );
}
