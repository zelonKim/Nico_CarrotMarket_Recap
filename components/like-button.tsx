"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/posts/[id]/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    // 서버에서 데이터를 받아오는 동안, 대신해서 해당 상태를 보여줌.
    { isLiked, likeCount }, // 상태 (state)
    (previousState) => ({
      // 상태 업데이트 함수 (reducerFn)
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );

  const onClick = async () => {
    reducerFn(undefined); // 인수를 상태 업데이트 함수의 payload 매개변수로 전달함.

    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 text-neutral-100 text-sm border border-neutral-100 rounded-full p-2  transition-colors ${
        state.isLiked
          ? "bg-green-500 text-white border-green-700 hover:bg-neutral-400"
          : "hover:bg-green-500 hover:border-white"
      }`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      {state.isLiked ? (
        <span> {state.likeCount}</span>
      ) : (
        <span>좋아요 ({state.likeCount})</span>
      )}
    </button>
  );
}
