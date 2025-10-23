"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function CloseBtn() {
  const router = useRouter();

  const onCloseClick = () => {
    router.back();
  };

  return (
    <button
      onClick={onCloseClick}
      className="absolute left-10 md:left-16 lg:left-24 xl:left-48 top-32 lg:top-20 xl:top-14 text-neutral-200"
    >
      <XMarkIcon className="size-10 hover:scale-110" />
    </button>
  );
}
