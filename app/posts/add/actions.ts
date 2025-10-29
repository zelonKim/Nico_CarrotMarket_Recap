"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { postSchema } from "./schema";
import { z } from "zod";

type PostFormState =
  | z.inferFlattenedErrors<typeof postSchema>
  | null
  | undefined;

export async function createPost(prevState: PostFormState, formData: FormData) {
  
  const data = {
    title: formData.get("title"),
    description: formData.get("description") || "",
  };

  const result = postSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  }

  const session = await getSession();

  if (session.id) {
    const post = await db.post.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        userId: session.id,
      },
      select: {
        id: true,
      },
    });
    redirect(`/posts/${post.id}`);
  }
}
