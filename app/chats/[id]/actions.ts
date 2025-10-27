"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteChatRoom(chatRoomId: string) {
  const session = await getSession();

  // 채팅방에 사용자가 포함되어 있는지 확인
  const room = await db.chatRoom.findUnique({
    where: {
      id: chatRoomId,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!room) {
    return { error: "채팅방을 찾을 수 없습니다." };
  }

  // 사용자가 채팅방에 속해있는지 확인
  const isUserInRoom = room.users.some((user) => user.id === session.id);
  if (!isUserInRoom) {
    return { error: "권한이 없습니다." };
  }

  // 채팅방 삭제
  await db.chatRoom.delete({
    where: {
      id: chatRoomId,
    },
  });

  revalidatePath("/chat");
  redirect("/chat");
}
