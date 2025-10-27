"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { createPost } from "./actions";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function AddPost() {
  const [state, action] = useFormState(createPost, null);

  return (
    <div className="p-4">
      <Link href="/life">
        <ArrowLeftIcon className="size-8 mt-4 text-white  hover:scale-110 " />
      </Link>
      <h1 className="font-semibold flex flex-row justify-center text-2xl mt-3 mb-3">
        생활 꿀팁 포스팅
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
            placeholder="내용"
            className="pl-5 pt-3 bg-transparent rounded-md w-full min-h-80 focus:outline-none ring-2 focus:ring-4 ring-neutral-200 transition focus:ring-orange-500 border-none placeholder:text-neutral-400 resize-none"
            rows={6}
          />
          {state?.fieldErrors?.description && (
            <span className="text-red-500 font-medium">
              {state.fieldErrors.description[0]}
            </span>
          )}
        </div>
        <Button text="글 올리기" />
      </form>
    </div>
  );
}
