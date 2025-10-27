"use server";

import db from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function getMoreProducts(page:number) {
  revalidateTag("home-products");
  console.log(page);

  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // skip: page * 1,
    // take: 1 ,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}
