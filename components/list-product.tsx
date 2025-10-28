import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
}

export default function ListProduct({
  title,
  price,
  created_at,
  photo,
  id,
}: ListProductProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="shadow-sm  flex gap-5 transition-colors hover:bg-orange-300 bg-orange-200 rounded-lg py-2 px-3"
    >
      <div className="relative size-24 rounded-full mt-1  overflow-hidden">
        <Image
          fill
          src={`${photo}/avatar`}
          alt={title}
          quality={100}
          className="bg-cover bg-center"
        />
      </div>
      <div className=" flex flex-col gap-1 ">
        <span className="text-lg font-semibold mt-2 text-neutral-800">
          {title}
        </span>

        <span className="text-md font-normal  text-neutral-700">
          {formatToWon(price)} 원
        </span>
        <span className="text-xs text-neutral-600 mt-2">
          {formatToTimeAgo(created_at.toString()) === "0일 전"
            ? "오늘"
            : formatToTimeAgo(created_at.toString())}
        </span>
      </div>
    </Link>
  );
}
