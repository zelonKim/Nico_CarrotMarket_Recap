"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { productSchema } from "./schema";
import { revalidatePath } from "next/cache";

export async function uploadProduct(formData: FormData) {
  const data = {
    title: formData.get("title"),
    photo: formData.get("photo"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  /*
  로컬 서버에 파일을 업로드함.
  if (data.photo instanceof File) {
    const photoData = await data.photo.arrayBuffer();

    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));

    data.photo = `/${data.photo.name}`;
  }
*/

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      revalidatePath(`/home`);
      redirect(`/home`);
    }
  }
}

export async function getUploadUrl() {
  // 클라우드플레어 로부터 이미지 업로드를 위한 one-time upload URL을 얻어옴.
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  return data;
}
