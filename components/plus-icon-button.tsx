"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function PlusIconButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/product/add");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-orange-500 flex justify-center items-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
    >
      <PlusIcon className="size-10" />
    </button>
  );
}
