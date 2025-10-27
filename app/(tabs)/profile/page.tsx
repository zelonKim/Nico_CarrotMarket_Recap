import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ProfileStats from "@/components/profile-stats";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

async function getUser() {
  const session = await getSession();

  if (session.id) {
    // 세션에 저장된 유저아이디가 있을 경우,
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound(); // 404에러 페이지를 보여줌.
}

async function getUserStats() {
  const session = await getSession();
  if (!session.id) {
    notFound();
  }

  const [productCount, postCount, chatRoomCount, liveStreamCount] =
    await Promise.all([
      db.product.count({
        where: {
          userId: session.id,
        },
      }),
      db.post.count({
        where: {
          userId: session.id,
        },
      }),
      db.chatRoom.count({
        where: {
          users: {
            some: {
              id: session.id,
            },
          },
        },
      }),
      db.liveStream.count({
        where: {
          userId: session.id,
        },
      }),
    ]);

  return {
    productCount,
    postCount,
    chatRoomCount,
    liveStreamCount,
  };
}


export const metadata = {
  title: "프로필",
};

export default async function Profile() {
  const user = await getUser();
  const stats = await getUserStats();

  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy(); // 세션을 제거함.
    redirect("/");
  };

  return (
    <div className="flex flex-col gap-6 p-7 mb-4">
      <div className="flex gap-4 justify-between items-center">
        <h1 className="text-2xl ms-1 font-bold">{user?.username}님의 캐럿</h1>
        <form action={logOut}>
          <button className=" bg-red-500 py-1 px-2 rounded-lg hover:bg-red-600 text-white">
            로그아웃
          </button>
        </form>
      </div>

      <ProfileStats
        productCount={stats.productCount}
        postCount={stats.postCount}
        chatRoomCount={stats.chatRoomCount}
        liveStreamCount={stats.liveStreamCount}
      />

      <div className="mt-4">
        <Link
          href="/profile/edit"
          className="text-lg font-semibold flex flex-row  gap-3 justify-center w-full bg-orange-500 text-white py-3 px-4 rounded-lg text-center hover:bg-orange-400 transition-colors"
        >
          프로필 변경하러 가기{" "}
          <ArrowRightIcon className="size-5 mt-1 font-bold" />
        </Link>
      </div>
    </div>
  );
}
