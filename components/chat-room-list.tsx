"use client";

import Link from "next/link";
import { ChatRoom } from "@prisma/client";

const defaultUserImg =
  "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg";

interface ChatRoomWithDetails extends ChatRoom {
  users: {
    id: number;
    username: string;
    avatar: string | null;
  }[];
  messages: {
    payload: string;
    created_at: Date;
    user: {
      username: string;
    };
  }[];
}

interface ChatRoomListProps {
  chatRooms: ChatRoomWithDetails[];
}

export default function ChatRoomList({ chatRooms }: ChatRoomListProps) {
  if (chatRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-orange-600 text-lg mb-2">
          아직 참여중인 채팅방이 없습니다
        </div>
        <div className="text-orange-600 text-sm">
          상품을 구매하거나 판매해보세요!
        </div>
      </div>
    );
  }

  return (
    <div className=" gap-3 grid lg:grid-cols-2">
      {chatRooms.map((chatRoom) => {
        const lastMessage = chatRoom.messages[0];

        return (
          <Link
            key={chatRoom.id}
            href={`/chats/${chatRoom.id}`}
            className="block p-4 shadow-sm bg-orange-200 rounded-lg hover:bg-orange-300 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                {chatRoom.users.slice(0, 3).map((user, index) => (
                  <div
                    key={user.id}
                    className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white text-sm font-medium border-2 border-orange-400"
                  >
                    {user.avatar && user.avatar !== "http://" ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src={defaultUserImg}
                        alt={"defaltImg"}
                        className="rounded-full border-0"
                      />
                    )}
                  </div>
                ))}
                {chatRoom.users.length > 3 && (
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-orange-500 text-xs font-semibold border-2 border-orange-600">
                    +{chatRoom.users.length - 3}
                  </div>
                )}
              </div>

              {/* 채팅방 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-orange-500 font-semibold truncate">
                    {chatRoom.users.length < 3
                      ? // ? otherUsers[0]?.username || "알 수 없음"
                        `${chatRoom.users[0].username}, ${chatRoom.users[1].username}의 채팅방`
                      : `${chatRoom.users[0].username}외 ${
                          chatRoom.users.length - 1
                        }명의 채팅방`}
                  </h3>

                  {lastMessage && (
                    <span className="text-neutral-700 text-xs">
                      {new Date(lastMessage.created_at).toLocaleDateString(
                        "ko-KR",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  )}
                </div>

                {lastMessage ? (
                  <p className="text-neutral-800 text-sm truncate mt-1">
                    <span className="text-neutral-800 font-semibold">
                      {lastMessage.user.username}:{" "}
                    </span>
                    {lastMessage.payload}
                  </p>
                ) : (
                  <p className="text-neutral-800 text-sm mt-1">
                    아직 메시지가 없습니다
                  </p>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
