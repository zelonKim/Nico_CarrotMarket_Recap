"use client";

import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useFormStatus } from "react-dom";
import type { MouseEvent } from "react";

export default function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="bg-red-500 py-1 px-2 rounded-lg hover:bg-red-600 text-white flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        // Cancel submission if the user does not confirm
        if (!confirm("정말 로그아웃 하시겠습니까?")) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {pending ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
