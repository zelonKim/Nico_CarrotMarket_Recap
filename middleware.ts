import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};

export async function middleware(request: NextRequest) {
  /*

    const session = await getSession();

    const exists = publicOnlyUrls[request.nextUrl.pathname]

    if(!session.id) { // 세션에 id가 없는 경우 -> 유저가 로그인 상태가 아닌 경우
        if(!exists) { // publicOnlyUrls로 이동하지 않는 경우
            return NextResponse.redirect(new URL("/", request.url))
        }
    }
    else { // 유저가 로그인 상태인 경우
        if(exists){ // publicOnlyUrls로 이동하는 경우
            return NextResponse.redirect(new URL("/home", request.url))
        } 
    }

    */
}

export const config = {
  // 미들웨어가 실행될 경로를 설정함.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
