"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { createPost } from "./actions";

export default function AddPost() {
  const [state, action] = useFormState(createPost, null);

  return (
    <>
      <h1 className="flex flex-row justify-center text-xl mt-36 mb-3">
        동네 생활 글 올리기
      </h1>
      <form className="p-5 flex flex-col gap-5 " action={action}>
        <Input
          name="title"
          required
          placeholder="제목"
          errors={state?.fieldErrors?.title}
        />
        <div className="flex flex-col gap-2">
          <textarea
            name="description"
            placeholder="본문"
            className="pl-3 pt-3 bg-transparent rounded-md w-full min-h-32 focus:outline-none ring-2 focus:ring-4 ring-neutral-200 transition focus:ring-orange-500 border-none placeholder:text-neutral-400 resize-none"
            rows={6}
          />
          {state?.fieldErrors?.description && (
            <span className="text-red-500 font-medium">
              {state.fieldErrors.description[0]}
            </span>
          )}
        </div>
        <Button text="포스팅하기" />
      </form>
    </>
  );
}
