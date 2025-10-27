"use client";

import { useRouter } from "next/navigation";

interface ProfileStatsProps {
  productCount: number;
  postCount: number;
  chatRoomCount: number;
  liveStreamCount: number;
}

export default function ProfileStats({
  productCount,
  postCount,
  chatRoomCount,
  liveStreamCount,
}: ProfileStatsProps) {
  const router = useRouter();

  const handleStatClick = (path: string) => {
    router.push(path);
  };

  const stats = [
    { label: "중고물품", count: productCount, path: "/home" },
    { label: "게시글", count: postCount, path: "/life" },
    { label: "채팅방", count: chatRoomCount, path: "/chat" },
    { label: "라이브 방송", count: liveStreamCount, path: "/live" },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 mt-2 ">
      {stats.map((stat) => (
        <button
          key={stat.label}
          onClick={() => handleStatClick(stat.path)}
          className="bg-orange-50 p-4 rounded-lg shadow-sm hover:bg-orange-200 hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-400"
        >
          <div className="text-gray-600  text-md mb-1">{stat.label}</div>
          <div className="text-2xl font-bold text-orange-500">{stat.count}</div>
        </button>
      ))}
    </div>
  );
}
