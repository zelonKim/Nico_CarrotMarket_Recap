"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { startStream } from "./actions";

export default function AddStream() {
  const [state, action] = useFormState(startStream, null);

  return (
    <div className="p-8">
      <h1 className="text-center text-xl font-semibold">라이브 방송 개설</h1>
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
