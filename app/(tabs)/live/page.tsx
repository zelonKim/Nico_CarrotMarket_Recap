import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

async function getInitialStreams() {
  const streams = await db.liveStream.findMany({
    select: {
      id: true,
      title: true,
      created_at: true,
      stream_id: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return streams;
}

export const metadata = {
  title: "라이브",
};

export default async function Live() {
  const streams = await getInitialStreams();

  return (
    <div>
      <div className="p-5 flex flex-col gap-2">
        <h1 className=" text-neutral-100 text-2xl font-bold mt-2 ms-4 mb-3">
          실시간 라이브 방송
        </h1>
        {streams.length === 0 ? (
          <div className="text-center text-neutral-500 py-20">
            <p>현재 진행 중인 라이브 방송이 없습니다.</p>
          </div>
        ) : (
          streams.map((stream) => (
            <Link
              key={stream.id}
              href={`/streams/${stream.id}`}
              className="flex gap-5 hover:bg-neutral-800 rounded-md p-3"
            >
              <div className="relative size-28 rounded-md overflow-hidden bg-neutral-600">
                {stream.stream_id ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-12 text-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                    <div className="absolute top-2 right-2">
                      <span className="text-xs font-semibold bg-red-500 text-white px-2 py-1 rounded">
                        LIVE
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-12 text-neutral-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 *:text-white flex-1">
                <div className="flex items-center gap-2">
                  <div className="size-6 overflow-hidden rounded-full">
                    {stream.user.avatar && stream.user.avatar !== "http://" ? (
                      <Image
                        src={stream.user.avatar}
                        width={24}
                        height={24}
                        alt={stream.user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="size-6 text-neutral-500" />
                    )}
                  </div>
                  <span className="text-xs text-neutral-400">
                    {stream.user.username}
                  </span>
                </div>
                <span className="text-lg font-semibold">{stream.title}</span>
                <span className="text-xs text-neutral-500">
                  {formatToTimeAgo(stream.created_at.toString()) === "0일 전"
                    ? "오늘"
                    : formatToTimeAgo(stream.created_at.toString())}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
      <Link
        href="/streams/add"
        className="bg-orange-500 flex justify-center items-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
