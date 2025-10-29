import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

const defaultUserImg =
  "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));

    if (!canSee) {
      return null;
    }
  }
  return room;
}

async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
}

async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id!,
    },
    select: {
      username: true,
      avatar: true,
    },
  });
  return user;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) {
    return (
      <div className="mt-80 flex flex-col justify-center items-center gap-2 text-xl">
        <ExclamationTriangleIcon className="size-8 " />
        <span>채팅방이 존재하지 않습니다.</span>
      </div>
    );
  }

  const initialMessages = await getMessages(params.id);

  const session = await getSession();

  const user = await getUserProfile();

  if (!user) {
    return notFound();
  }

  if (user.avatar === "http://") {
    user.avatar = defaultUserImg;
  }

  return (
    <ChatMessagesList
      chatRoomId={params.id}
      userId={session.id!}
      username={user.username}
      avatar={user.avatar || defaultUserImg}
      initialMessages={initialMessages}
      participants={room.users}
    />
  );
}
