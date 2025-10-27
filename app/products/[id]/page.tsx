import db from "@/lib/db";
// import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { ArrowLeftIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  unstable_cache as nextCache,
  revalidatePath,
  revalidateTag,
} from "next/cache";
import getSession from "@/lib/session";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

const getCahcedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

///////////////

async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
}

const getCahcedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title"],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCahcedProductTitle(Number(params.id));

  return {
    title: product?.title,
  };
}

/////////////////////////////////////

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  if (isNaN(id)) {
    // Not a Number
    return notFound();
  }

  const product = await getCahcedProduct(id);

  if (!product) {
    return <div>해당 제품이 없습니다.</div>;
  }

  const isOwner = await getIsOwner(product.userId);

  const revalidate = async () => {
    "use server";
    revalidateTag("product-title"); // 해당 태그를 가진 캐시 함수를 다시 실행함.
  };

  const deleteProduct = async () => {
    "use server";

    const success = await db.product.delete({
      where: {
        id,
      },
    });
    if (success) {
      revalidatePath("/home");
      redirect("/home");
    } else {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const createChatRoom = async () => {
    "use server";
    const session = await getSession();

    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [
            {
              id: product.userId,
            },
            {
              id: session.id,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });
    redirect(`/chats/${room.id}`);
  };

  return (
    <div className="p-6">
      <Link href="/home">
        <ArrowLeftIcon className="size-8 md:ms-8 lg:ms-4  mb-3  hover:scale-110 text-white" />
      </Link>
      <div className="relative aspect-square max-h-[560px] lg:max-h-[600px] mx-auto  rounded-md">
        <Image
          fill
          src={`${product.photo}/public`}
          alt={product.title}
          className="rounded-md"
        />
      </div>
      <div className="p-5 mt-2 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>

      <div className="p-5 mb-28">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>

      <div className="fixed w-full bottom-0 left-0 p-6 pb-6  bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>

        {isOwner ? (
          <form action={deleteProduct}>
            <button className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-md text-white font-semibold">
              삭제하기
            </button>
          </form>
        ) : (
          <form action={createChatRoom}>
            <button className="bg-orange-500 hover:bg-orange-400 px-5 py-2.5 rounded-md text-white font-semibold">
              채팅하기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
/*
export const dynamicParams = false;
//  동적으로 새로운 페이지를 생성하지 않고, 오직 빌드할때 미리 생성된 페이지들만 사용함.
// (기본값은 true)

export async function generateStaticParams() {
  // 빌드시, SSG(Static Site Generation) 페이지로 만들어줌.
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });

  return products.map((product) => ({ id: product.id + "" })); // [id]자리에 올 수 있는 값들을 리턴시켜줌.
}
*/
