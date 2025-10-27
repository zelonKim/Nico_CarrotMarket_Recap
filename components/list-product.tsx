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
      className="flex gap-5 hover:bg-orange-300 bg-orange-200 rounded-lg p-3"
    >
      <div className="relative size-28 rounded-full  overflow-hidden">
        <Image
          fill
          src={`${photo}/avatar`}
          alt={title}
          quality={100}
          className="bg-cover bg-center"
        />
      </div>
      <div className=" flex flex-col gap-1 *:text-neutral-800">
        <span className="text-lg font-semibold mt-4">{title}</span>

        <span className="text-md font-semibold">{formatToWon(price)}원</span>
        <span className="text-xs text-neutral-500 mt-2">
          {formatToTimeAgo(created_at.toString()) === "0일 전"
            ? "오늘"
            : formatToTimeAgo(created_at.toString())}
        </span>
      </div>
    </Link>
  );
}
