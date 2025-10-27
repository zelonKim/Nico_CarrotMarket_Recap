"use client";

import { useRouter } from "next/navigation";

interface DeleteProductButtonProps {
  deleteProduct: () => Promise<void>;
}

export default function DeleteProductButton({
  deleteProduct,
}: DeleteProductButtonProps) {
  const router = useRouter();

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmed = confirm("정말로 삭제하시겠습니까?");
    if (confirmed) {
      await deleteProduct();
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-md text-white font-semibold"
      >
        삭제하기
      </button>
    </form>
  );
}
