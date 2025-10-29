"use client";

import { endStream } from "@/app/streams/[id]/actions";
import { VideoCameraSlashIcon } from "@heroicons/react/24/solid";
import { useTransition } from "react";

interface EndStreamButtonProps {
  streamId: number;
}

export default function EndStreamButton({ streamId }: EndStreamButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleEndStream = () => {
    if (confirm("정말 방송을 종료하시겠습니까?")) {
      startTransition(async () => {
        await endStream(streamId);
      });
    }
  };

  return (
    <button
      onClick={handleEndStream}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <VideoCameraSlashIcon className="size-5" />
      종료하기
    </button>
  );
}
