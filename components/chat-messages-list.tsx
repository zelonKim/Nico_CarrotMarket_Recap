"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ArrowLeftIcon,
  ArrowRightEndOnRectangleIcon,
  ArrowUpCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import {
  ForwardRefExoticComponent,
  SVGProps,
  useEffect,
  useRef,
  useState,
} from "react";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { saveMessage } from "@/app/(tabs)/chat/action";
import { deleteChatRoom } from "@/app/chats/[id]/actions";
import db from "@/lib/db";
import Link from "next/link";

const defaultUserImg =
  "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg";

const SUPABASE_URL = "https://nyzoagzdjkqolbtyuduc.supabase.co";

const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55em9hZ3pkamtxb2xidHl1ZHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNzM2MTcsImV4cCI6MjA3Njg0OTYxN30.ZZpajHOnRH9wxkfQo-Ize7XFYEiW2PCwzsnzEI-6ggw";

interface Param {
  id: string;
}

interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string;
  participants: {
    id: number;
    username: string;
    avatar: string | null;
  }[];
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avatar,
  participants,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);

  const [message, setMessage] = useState("");
  const [showUsername, setShowUsername] = useState<string | null>(null);

  const channel = useRef<RealtimeChannel>();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: "anonym",
          avatar: "/anonym.jpeg",
        },
      },
    ]);

    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username,
          avatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
  };

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);

    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  const onLeaveChatRoom = async () => {
    if (confirm("정말 채팅방을 나가시겠습니까?")) {
      await deleteChatRoom(chatRoomId);
    }
  };

  return (
    <div>
      <div className="md:rounded-md bg-neutral-800 flex flex-row justify-between items-center py-3 px-4  border-b border-neutral-700">
        <div className="flex gap-2 items-center">
          <Link href="/chat">
            <ArrowLeftIcon className="size-8 mr-4 ms-1 text-white  hover:scale-110 " />
          </Link>
          {participants.map((participant) => (
            <div key={participant.id} className="relative">
              <button
                onMouseOver={() =>
                  setShowUsername(
                    showUsername === participant.username
                      ? null
                      : participant.username
                  )
                }
                onMouseOut={() => setShowUsername(null)}
                className="relative"
              >
                <Image
                  src={participant.avatar || defaultUserImg}
                  alt={participant.username}
                  width={40}
                  height={40}
                  className="size-11 rounded-full border-2 border-neutral-700 hover:border-orange-500 transition-colors"
                />
              </button>
              {showUsername === participant.username && (
                <div className="absolute left-0 top-12 bg-neutral-700 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap z-10">
                  {participant.username}
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={onLeaveChatRoom}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
        >
          <ArrowRightEndOnRectangleIcon className="size-5" />
          채팅방 나가기
        </button>
      </div>

      <div className="p-6 flex flex-col gap-5 min-h-screen justify-end pb-24">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 items-start ${
              message.userId === userId ? "justify-end" : ""
            }`}
          >
            {message.userId === userId ? null : (
              <Image
                src={message.user.avatar || defaultUserImg}
                alt={message.user.username}
                width={50}
                height={50}
                className="size-8 rounded-full"
              />
            )}
            <div
              className={`flex flex-col gap-1 ${
                message.userId === userId ? "items-end" : ""
              }`}
            >
              <span
                className={`${
                  message.userId === userId ? "bg-neutral-500" : "bg-orange-500"
                } p-2.5 rounded-md`}
              >
                {message.payload}
              </span>
              <span className="text-xs">
                {formatToTimeAgo(message.created_at.toString())}
              </span>
            </div>
          </div>
        ))}
        <form className="flex relative mt-2" onSubmit={onSubmit}>
          <input
            required
            onChange={onChange}
            value={message}
            className=" bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-3 transition ring-neutral-200 focus:ring-orange-500 focus:bg-neutral-800 border-none placeholder:text-neutral-400"
            type="text"
            name="message"
            placeholder="메시지를 입력해주세요."
          />
          <button className="absolute right-0">
            <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
          </button>
        </form>
      </div>
    </div>
  );
}
