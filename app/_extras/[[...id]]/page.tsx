import HackedComponent from "@/components/hacked-component";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import {
  experimental_taintUniqueValue,
} from "react";
import heavyImage from "../../../public/heavy-image.jpeg";

async function getData() {
  fetch("https://nomad-movies.nomadcoders.workers.dev/movies");
}

function getSecret() {
  const keys = {
    apiKey: "4389u5ajkarew3",
    secretKey: "1847394034830",
  };
  // experimental_taintObjectReference("키 정보가 유출되었습니다.", keys); // 해당 객체 전체가 클라이언트단에서 노출되었을때 주어진 에러를 발생시킴.
  experimental_taintUniqueValue(
    "시크릿키가 노출되었습니다.",
    keys,
    keys.secretKey
  ); // 해당 객체의 특정 밸류가 노출되었을때 주어진 에러를 발생시킴.
  return keys;
}

export default async function Extras({ params }: { params: { id: string[] } }) {
  await getData();

  const action = async () => {
    "use server";
    revalidatePath("/extras");
  };

  const data = getSecret();

  return (
    <div className="flex flex-col gap-3 py-10">
      <h1 className="text-6xl font-metallica">Extras!</h1>
      <h2 className="font-roboto">So much more to learn!</h2>
      <h2 className="font-roboto">{params.id}</h2>
      <HackedComponent data={data.apiKey} />
      <Image src={heavyImage} alt="heavyImage" placeholder="blur" />
      <form action={action}>
        <button>최신화</button>
      </form>
    </div>
  );
}
