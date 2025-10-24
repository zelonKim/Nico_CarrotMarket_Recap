"use client";

import Link from "next/link";
import { ChatRoom } from "@prisma/client";

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
        <div className="text-gray-400 text-lg mb-2">
          아직 참여중인 채팅방이 없습니다
        </div>
        <div className="text-gray-500 text-sm">
          상품을 구매하거나 판매해보세요!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {chatRooms.map((chatRoom) => {
        const otherUsers = chatRoom.users.filter(
          (user) => user.id !== chatRoom.users[0]?.id
        );
        const lastMessage = chatRoom.messages[0];

        return (
          <Link
            key={chatRoom.id}
            href={`/chats/${chatRoom.id}`}
            className="block p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {/* 채팅방 참여자 아바타들 */}
              <div className="flex -space-x-2">
                {chatRoom.users.slice(0, 3).map((user, index) => (
                  <div
                    key={user.id}
                    className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium border-2 border-gray-800"
                  >
                    {user.avatar && user.avatar !== "http://" ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      user.username.charAt(0).toUpperCase()
                    )}
                  </div>
                ))}
                {chatRoom.users.length > 3 && (
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium border-2 border-gray-800">
                    +{chatRoom.users.length - 3}
                  </div>
                )}
              </div>

              {/* 채팅방 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium truncate">
                    {chatRoom.users.length === 2
                      ? otherUsers[0]?.username || "알 수 없음"
                      : `${chatRoom.users.length}명의 채팅방`}
                  </h3>
                  {lastMessage && (
                    <span className="text-gray-400 text-xs">
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
                  <p className="text-gray-400 text-sm truncate mt-1">
                    <span className="text-gray-500">
                      {lastMessage.user.username}:{" "}
                    </span>
                    {lastMessage.payload}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm mt-1">
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
