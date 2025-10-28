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
    const confirmed = confirm("정말로 해당 중고물품을 내리시겠습니까?");
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
        판매완료
      </button>
    </form>
  );
}
