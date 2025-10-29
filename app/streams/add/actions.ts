"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { streamSchema } from "./schema";
import { z } from "zod";

type StreamFormState =
  | z.inferFlattenedErrors<typeof streamSchema>
  | null
  | undefined;

export async function startStream(
  prevState: StreamFormState,
  formData: FormData
) {
  const results = streamSchema.safeParse({
    title: formData.get("title"),
  });
  if (!results.success) {
    return results.error.flatten();
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
      body: JSON.stringify({
        meta: {
          name: results.data.title,
        },
        recording: {
          mode: "automatic",
        },
      }),
    }
  );
  const data = await response.json();
  const session = await getSession();

  const stream = await db.liveStream.create({
    data: {
      title: results.data.title,
      stream_id: data.result.uid,
      stream_key: data.result.rtmps.streamKey,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
  redirect(`/streams/${stream.id}`);
}
