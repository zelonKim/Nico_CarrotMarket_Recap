"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function NextBtn() {
  const onNextClick = () => {
    window.location.reload();
  };

  return (
    <button
      onClick={onNextClick}
      className="absolute right-10 md:right-16 lg:right-24 xl:right-48 top-32 lg:top-20 xl:top-14 text-neutral-200"
    >
      <ArrowRightIcon className="size-10 hover:scale-110 hover:text-orange-500" />
    </button>
  );
}
