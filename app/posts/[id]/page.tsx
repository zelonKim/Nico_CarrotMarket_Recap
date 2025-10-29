import LikeButton from "@/components/like-button";
import DeletePostButton from "@/components/delete-post-button";
import DeleteCommentButton from "@/components/delete-comment-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import CommentForm from "@/components/comment-form";
import { deleteComment } from "./actions";

const defaultUserImg =
  "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg";

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

async function getComments(postId: number) {
  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    select: {
      id: true,
      payload: true,
      userId: true,
      created_at: true,
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
  return comments;
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
  const comments = await getComments(id);

  return (
    <div className="p-8 max-w-screen-md mx-auto ">
      <Link href="/life">
        <ArrowLeftIcon className="size-8   text-neutral-600 hover:text-neutral-700  hover:scale-110 " />
      </Link>

      <div className="shadow-sm flex flex-col  px-10 py-8 mt-10 text-neutral-800 -z-50 bg-orange-400 rounded-lg ">
        {isOwner && <DeletePostButton deletePost={deletePost} />}
        <div className="flex items-center gap-2 mb-2">
          {post.user.avatar === "http://" ? (
            <Image
              width={32}
              height={32}
              className="size-10 rounded-full"
              src={defaultUserImg}
              alt={post.user.username || "익명"}
            />
          ) : (
            <Image
              width={32}
              height={32}
              className="size-10 rounded-full"
              src={post.user.avatar!}
              alt={post.user.username || "익명"}
            />
          )}

          <div className="flex flex-row gap-48 sm:gap-[320px]  md:gap-[450px]">
            <div className="flex flex-col items-start ms-2">
              <span className="text-lg font-normal">{post.user.username}</span>
              <span className="text-xs">
                {formatToTimeAgo(post.created_at.toString())}
              </span>
            </div>

            <div className=" flex flex-row gap-2 text-neutral-100 text-sm text-nowrap ">
              <EyeIcon className="size-5" />
              <span>조회 {post.views}</span>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-semibold mt-8 ms-2">{post.title}</h2>
        <p className="mt-3 ms-2">{post.description}</p>
        <div className="flex flex-col gap-5 items-end mt-5">
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
        </div>
      </div>

      <div className="mt-8 px-4">
        <h3 className="text-lg font-semibold mb-4 text-neutral-800">
          댓글 {comments.length}
        </h3>

        {comments.length > 0 ? (
          <div className="space-y-4 mb-8 bg-orange-200  p-4 rounded-md shadow-sm">
            {comments.map((comment) => {
              const isCommentOwner = comment.userId === session.id;
              const handleDeleteComment = async () => {
                "use server";
                await deleteComment(comment.id, id);
              };

              return (
                <div
                  key={comment.id}
                  className="flex items-start gap-4 border-b border-orange-400 pb-4 last:pb-0 last:border-b-0"
                >
                  {comment.user.avatar === "http://" ? (
                    <Image
                      width={32}
                      height={32}
                      className="size-10 rounded-full"
                      src={defaultUserImg}
                      alt={comment.user.username || "익명"}
                    />
                  ) : (
                    <Image
                      width={32}
                      height={32}
                      className="size-10 rounded-full"
                      src={comment.user.avatar!}
                      alt={comment.user.username || "익명"}
                    />
                  )}
                  <div className="flex-1 ">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-neutral-800">
                        {comment.user.username}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {formatToTimeAgo(comment.created_at.toString())}
                      </span>
                      {isCommentOwner && (
                        <DeleteCommentButton
                          deleteComment={handleDeleteComment}
                        />
                      )}
                    </div>
                    <p className="text-neutral-700">{comment.payload}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
        <CommentForm postId={id} />
      </div>
    </div>
  );
}
