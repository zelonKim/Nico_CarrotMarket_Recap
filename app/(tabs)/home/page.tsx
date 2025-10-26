import PlusIconButton from "@/components/plus-icon-button";
import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { unstable_cache as nextCache } from "next/cache";

const getCachedProducts = nextCache(
  // 해당 함수 실행 결과를 주어진 키로 캐싱함.
  getInitialProducts,
  ["home-products"],
  { revalidate: 30 } // 30초가 지난 후 새로운 요청이 있을 경우, 해당 함수를 다시 호출함.
);

async function getInitialProducts() {
  //await new Promise(resolve => setTimeout(resolve, 5000));
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    //take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata = {
  title: "홈",
};

// export const dynamic = "force-dynamic"; // 빌드시, 다이나믹 페이지로 강제함.

// export const revalidate = 60; // 빌드시, 데이터 최신화 시간(초)을 설정함.

//////////////////////

export default async function Products() {
  const initialProducts = await getCachedProducts();

  return (
    <div>
      <ProductList initialProducts={initialProducts} />

      <PlusIconButton />
    </div>
  );
}
