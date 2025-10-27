import Link from "next/link";
import "@/lib/db";

export default function Home() {
  return (
    <div
      style={{ backgroundImage: `url("/carrotBg.png")` }}
      className="bg-cover bg-center"
    >
      <div className=" flex flex-col items-start justify-between min-h-screen p-6">
        <div className="flex flex-col items-start gap-2 *:font-medium">
          {/* <span className="text-9xl">🥕</span> */}
          {/* <h1 className="text-4xl ">Carrot Market</h1>
        <h2 className="text-xl">실시간 중고거래 플랫폼</h2> */}
          <h2 className="text-white font-thin text-2xl lg:text-3xl xl:text-4xl ml-10 mt-12 lg:mt-24 xl:mt-36 lg:ml-[170px] xl:ml-[270px]">
            당신 근처의
          </h2>
          <h2 className="text-white text-4xl lg:text-5xl xl:text-6xl ml-8   lg:mt-4 xl:mt-6 lg:ml-[148px] xl:ml-[243px] ">
            캐럿 마켓 <span className="text-5xl ">🥕</span>
          </h2>
        </div>

        <div className="flex flex-col  items-center gap-3 w-full">
          <Link
            href="/login"
            className="w-full  lg:w-5/6 xl:w-3/4 bg-amber-500 hover:!bg-amber-400 border-2 border-white text-white text-lg font-medium py-2.5 rounded-md text-center  transition-colors"
          >
            로그인하기
          </Link>
          <Link
            href="/create-account"
            // style={{ backgroundColor: "orange" }}
            className=" w-full  lg:w-5/6 xl:w-3/4 bg-green-600  hover:!bg-green-500 border-2 border-white text-white text-lg font-medium py-2.5 rounded-md text-center  transition-colors"
          >
            회원가입하기
          </Link>
          <span className="text-white">
            ⓒ 2025. zelon. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
