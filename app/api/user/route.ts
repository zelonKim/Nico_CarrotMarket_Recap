import { NextResponse } from "next/server";
import getSession from "@/lib/session";
import db from "@/lib/db";

export async function GET() {
  const session = await getSession();

  if (!session.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      id: true,
      username: true,
      phone: true,
      avatar: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
