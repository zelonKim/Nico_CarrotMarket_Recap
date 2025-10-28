"use client";

import { addComment } from "@/app/posts/[id]/actions";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { FormEvent, useState } from "react";

interface CommentFormProps {
  postId: number;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    await addComment(comment, postId);

    setComment("");
    setIsPending(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        disabled={isPending}
        placeholder="댓글을 입력해주세요."
        className="flex-1 bg-orange-100 text-neutral-800 placeholder:text-neutral-500 px-4 py-2 rounded-lg focus:outline-none ring-2 ring-neutral-400 focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
      />
      <button
        disabled={isPending}
        className="disabled:opacity-50 transition-opacity"
      >
        <ArrowUpCircleIcon className="size-10 text-orange-500 hover:text-orange-600" />
      </button>
    </form>
  );
}
