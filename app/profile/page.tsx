import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getUser() {
    const session = await getSession();

    if(session.id) { // 세션에 저장된 유저아이디가 있을 경우,
        const user = await db.user.findUnique({
            where: {
                id: session.id,
            }
        })
        if(user) {
            return user;
        }
    }
    notFound(); // 404에러 페이지를 보여줌.
}



export default async function Profile() {
    const user = await getUser();

    const logOut = async () => {
        "use server";
        const session = await getSession();
        await session.destroy(); // 세션을 제거함.
        redirect("/");
    }

    return (
        <div>
            <h1>Welcome! {user?.username}</h1>
            <form action={logOut}>
                <button>로그아웃</button>
            </form>
        </div>
    )

}