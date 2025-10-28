"use client";

import { TrashIcon } from "@heroicons/react/24/solid";

interface DeleteCommentButtonProps {
  deleteComment: () => Promise<void>;
}

export default function DeleteCommentButton({
  deleteComment,
}: DeleteCommentButtonProps) {
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const confirmed = confirm("정말 이 댓글을 삭제하시겠습니까?");
    if (confirmed) {
      await deleteComment();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-600 transition-colors"
    >
      <TrashIcon className="size-4" />
    </button>
  );
}
