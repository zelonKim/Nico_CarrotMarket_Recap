import LikeButton from "@/components/like-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

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
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  const post = await getCachedPost(id);

  if (!post) {
    return <div>게시물이 존재하지 않습니다.</div>;
  }

  const { isLiked, likeCount } = await getCachedLikeStatus(id);

  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.user.avatar!}
          alt={post.user.username}
        />
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id}/>
      </div>
    </div>
  );
}
