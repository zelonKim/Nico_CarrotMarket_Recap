import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

async function getPosts() {
  // await new Promise(r => setTimeout(r,100000))
  const posts = await db.post.findMany({
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });
  return posts;
}

export const metadata = {
  title: "동네 생활",
};

/////////////////////////

export default async function Life() {
  const posts = await getPosts();

  return (
    <div className="p-5">
      <h1 className=" text-neutral-100 text-2xl font-bold mt-2 -mb-2 ms-4">
        생활 꿀팁 게시글
      </h1>
      <div className="py-5 flex flex-col ">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="hover:rounded-sm p-4 border-b border-neutral-500 hover:bg-neutral-800 text-neutral-400 flex  flex-col gap-2  last:border-b-0"
          >
            <h2 className="text-white text-lg font-semibold">{post.title}</h2>
            <p>{post.description}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-4 items-center">
                <span>{formatToTimeAgo(post.created_at.toString())}</span>
                <span>·</span>
                <span>조회 {post.views}</span>
              </div>
              <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
                <span>
                  <HandThumbUpIcon className="size-4" />
                  {post._count.likes}
                </span>
                <span>
                  <ChatBubbleBottomCenterIcon className="size-4" />
                  {post._count.comments}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/posts/add"
        className="bg-orange-500 flex justify-center items-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
