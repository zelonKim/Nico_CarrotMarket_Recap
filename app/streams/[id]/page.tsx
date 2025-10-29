import db from "@/lib/db";
import getSession from "@/lib/session";
import { ArrowLeftIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import EndStreamButton from "@/components/end-stream-button";

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

  const isOwner = stream.userId === session.id;

  return (
    <div className="p-10 *:text-neutral-800 max-w-screen-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href="/live">
          <ArrowLeftIcon className="size-8 hover:scale-110 hover:text-neutral-700 text-neutral-600 cursor-pointer" />
        </Link>
        {isOwner && <EndStreamButton streamId={id} /> }
      </div>
      <div className="relative aspect-video">
        <iframe
          src={process.env.CLOUDFLARE_DOMAIN}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          className="w-full h-full rounded-md"
        ></iframe>
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-orange-400">
        <div className="size-10 overflow-hidden rounded-full">
          {stream.user.avatar && stream.user.avatar !== "http://" ? (
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
        <div className="mt-16 bg-orange-400 text-black p-5 rounded-lg ">
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
