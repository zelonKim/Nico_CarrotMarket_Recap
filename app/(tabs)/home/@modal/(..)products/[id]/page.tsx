import CloseBtn from "@/components/close-btn";
import NextBtn from "@/components/next-btn";
import db from "@/lib/db";
import { formatToWon } from "@/lib/utils";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const defaultUserImg =
  "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg";

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

export default async function Modal({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const product = await getProduct(id);

  return (
    <div>
      <div className="absolute w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-60 left-0 top-0">
        <div className="max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg h-1/2 lg:h-2/3 xl:h-3/4 flex justify-center w-full">
          <CloseBtn />
          <NextBtn />

          <div className="relative aspect-square flex justify-center bg-neutral-100  rounded-lg  ">
            {product?.photo ? (
              <Image
                src={`${product?.photo}/public`}
                alt={product?.title}
                fill
                className="rounded-l-lg "
              />
            ) : (
              <PhotoIcon className="h-28" />
            )}
          </div>
          <div className="bg-orange-100 rounded-e-lg w-80 pl-8 pr-6 flex flex-col items-center pt-16">
            <div className="text-neutral-800 text-2xl mt-2">
              {product?.title}
            </div>
            <div className="text-lg mt-3">
              {product ? formatToWon(product.price) : "0"} 원
            </div>

            <div className="text-md flex flex-col  md:flex-row  gap-3 mt-14 ">
              {product?.user.avatar ? (
                <Image
                  src={`${product?.user.avatar}/avatar`}
                  alt={product?.user.username || "익명"}
                  width={32}
                  height={32}
                  className="rounded-full max-h-8"
                />
              ) : (
                <Image
                  src={defaultUserImg}
                  alt={product?.user.username || "익명"}
                  width={32}
                  height={32}
                  className="rounded-full max-h-8"
                />
              )}
              <span className="mt-1 "> {product?.user.username} </span>
              <span className="mt-1 md:ms-2 font-thin text-black">
                {product?.description}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
