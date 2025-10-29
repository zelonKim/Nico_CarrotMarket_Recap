"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag, revalidatePath } from "next/cache";

export async function likePost(postId: number) {
  // await new Promise((r) => setTimeout(r, 5000));

  const session = await getSession();
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (err) {
    console.log(err);
  }
}

export async function dislikePost(postId: number) {
  //await new Promise((r) => setTimeout(r, 5000));

  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (err) {
    console.log(err);
  }
}

export async function addComment(payload: string, postId: number) {
  "use server";
  const session = await getSession();

  if (!session.id) {
    return;
  }

  try {
    await db.comment.create({
      data: {
        payload,
        postId,
        userId: session.id!,
        
      },
    });
    revalidatePath(`/posts/${postId}`);
    revalidateTag(`post-detail`);
  } catch (err) {
    console.log(err);
  }
}

export async function deleteComment(commentId: number, postId: number) {
  "use server";
  const session = await getSession();

  if (!session.id) {
    return;
  }

  try {
    await db.comment.delete({
      where: {
        id: commentId,
        userId: session.id!, // 자신의 댓글만 삭제 가능
      },
    });
    revalidatePath(`/posts/${postId}`);
    revalidateTag(`post-detail`);
  } catch (err) {
    console.log(err);
  }
}
