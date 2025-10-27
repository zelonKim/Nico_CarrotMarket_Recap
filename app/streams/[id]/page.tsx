import db from "@/lib/db";
import getSession from "@/lib/session";
import { ArrowLeftIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getStream(id: number) {
  const stream = await db.liveStream.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      stream_key: true,
      stream_id: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return stream;
}

export default async function StreamDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const stream = await getStream(id);
  if (!stream) {
    return <div>스트리밍이 존재하지 않습니다.</div>;
  }

  const session = await getSession();

  return (
    <div className="p-10">
      <Link href="/live">
        <ArrowLeftIcon className="size-6 mb-6 hover:scale-110 text-white cursor-pointer" />
      </Link>
      <div className="relative aspect-video">
        <iframe
          src={process.env.CLOUDFLARE_DOMAIN}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          className="w-full h-full rounded-md"
        ></iframe>
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {stream.user.avatar !== null ? (
            <Image
              src={stream.user.avatar}
              width={40}
              height={40}
              alt={stream.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{stream.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{stream.title}</h1>
      </div>
      {stream.userId === session.id! ? (
        <div className="mt-16 bg-orange-300 text-black p-5 rounded-lg ">
          <div className="flex gap-2">
            <span className="font-semibold">* 스트리밍 URL:</span>
            <span>rtmps://live.cloudflare.com:443/live/</span>
          </div>
          <div className="flex flex-nowrap ">
            <span className="font-semibold text-nowrap ">
              * 시크릿 키: &nbsp;
            </span>
            <span className="text-wrap">{stream.stream_key}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
