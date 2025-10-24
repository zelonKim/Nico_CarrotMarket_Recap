import { getChatRooms } from "./action";
import ChatRoomList from "@/components/chat-room-list";

export default async function Chat() {
  const chatRooms = await getChatRooms();

  return (
    <div className="p-4">
      <h1 className="text-white text-2xl font-bold mb-6">채팅방 목록</h1>
      <ChatRoomList chatRooms={chatRooms} />
    </div>
  );
}
