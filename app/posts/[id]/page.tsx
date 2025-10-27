import LikeButton from "@/components/like-button";
import DeletePostButton from "@/components/delete-post-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/solid";
import {
  unstable_cache as nextCache,
  revalidatePath,
  revalidateTag,
} from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      // 업데이트가 완료된 데이터를 반환함.
      where: {
        // 해당 기준을 통해 업데이할 데이터를 찾음.
        id,
      },
      data: {
        // 업데이트할 컬럼과 연산을 지정함.
        views: {
          increment: 1, // 기존의 개수에서 1을 더해줌.
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (err) {
    console.log(err);
    return null;
  }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: [`post-detail`],
  revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId,
      },
    },
  });

  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });

  return {
    isLiked: Boolean(isLiked),
    likeCount,
  };
}

async function getCachedLikeStatus(postId: number) {
  const session = await getSession();
  const userId = session.id;

  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });

  return cachedOperation(postId, userId!);
}

////////////////////////////

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  async function deletePost() {
    "use server";
    const success = await db.post.delete({
      where: {
        id,
      },
    });
    if (success) {
      revalidatePath("/life");
      redirect("/life");
    }
  }

  const post = await getCachedPost(id);

  if (!post) {
    return <div>게시물이 존재하지 않습니다.</div>;
  }

  const isOwner = post.userId === session.id;

  const { isLiked, likeCount } = await getCachedLikeStatus(id);

  return (
    <div className="p-6">
      <Link href="/life">
        <ArrowLeftIcon className="size-8 mt-8 text-white  hover:scale-110 " />
      </Link>

      <div className="px-10 py-8 mt-10 text-white -z-50 bg-neutral-800 rounded-lg ">
        {isOwner && <DeletePostButton deletePost={deletePost} />}
        <div className="flex items-center gap-2 mb-2">
          <Image
            width={32}
            height={32}
            className="size-10 rounded-full"
            src={post.user.avatar!}
            alt={post.user.username}
          />
          <div className="flex flex-row gap-48 sm:gap-[320px]  md:gap-[450px]">
            <div className="flex flex-col items-start ms-2">
              <span className="text-lg font-normal">{post.user.username}</span>
              <span className="text-xs">
                {formatToTimeAgo(post.created_at.toString())}
              </span>
            </div>

            <div className=" flex flex-row gap-2 text-neutral-400 text-sm">
              <EyeIcon className="size-5" />
              <span>조회 {post.views}</span>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-semibold mt-8 ms-2">{post.title}</h2>
        <p className="mt-3 ms-2">{post.description}</p>
        <div className=" flex flex-col gap-5 items-end mt-5">
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
        </div>
      </div>
    </div>
  );
}
