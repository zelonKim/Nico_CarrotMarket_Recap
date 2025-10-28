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
        <TrashIcon className="size-5  mb-3 -mt-5  ms-[360px]  sm:ms-[510px] md:ms-[625px] text-red-500 hover:text-red-600" />
      </button>
    </form>
  );
}
