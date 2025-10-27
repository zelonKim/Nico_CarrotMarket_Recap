"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function endStream(streamId: number) {
  const session = await getSession();

  if (!session.id) {
    return { error: "인증이 필요합니다." };
  }

  // 스트림 존재 여부 및 권한 확인
  const stream = await db.liveStream.findUnique({
    where: {
      id: streamId,
    },
    select: {
      userId: true,
    },
  });

  if (!stream) {
    return { error: "스트림을 찾을 수 없습니다." };
  }

  // 스트림 소유자인지 확인
  if (stream.userId !== session.id) {
    return { error: "권한이 없습니다." };
  }

  // 스트림 삭제
  await db.liveStream.delete({
    where: {
      id: streamId,
    },
  });

  revalidatePath("/live");
  redirect("/live");
}
