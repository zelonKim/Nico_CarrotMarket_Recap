"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveMessage(payload: string, chatRoomId: string) {
  const session = await getSession();
  await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
}

export async function getChatRooms() {
  const session = await getSession();
  if (!session.id) {
    return [];
  }

  const chatRooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: session.id,
        },
      },
    },
    include: {
      users: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      messages: {
        orderBy: {
          created_at: "desc",
        },
        take: 1,
        select: {
          payload: true,
          created_at: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      },
    },
    orderBy: {
      updated_at: "desc",
    },
  });

  return chatRooms;
}

export async function deleteChatRoom(id: string) {
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
