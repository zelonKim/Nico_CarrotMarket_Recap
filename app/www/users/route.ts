// API route handler (receive an HTTP request then returns JSON or redirect user  )

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log(request);

  return Response.json({
    ok: true,
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json(); // post요청된 body 데이터를 가져옴.
  console.log("유저가 로그인 하였습니다.");

  return Response.json(data);
}
