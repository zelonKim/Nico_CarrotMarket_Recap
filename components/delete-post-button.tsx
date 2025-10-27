"use client";

import { TrashIcon } from "@heroicons/react/24/solid";

interface DeletePostButtonProps {
  deletePost: () => Promise<void>;
}

export default function DeletePostButton({
  deletePost,
}: DeletePostButtonProps) {
  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmed = confirm("정말 삭제하시겠습니까?");
    if (confirmed) {
      await deletePost();
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <button>
        <TrashIcon className="size-4 ms-[380px] mb-3 -mt-3  sm:ms-[520px] md:ms-[640px] text-neutral-300 hover:text-red-400" />
      </button>
    </form>
  );
}
