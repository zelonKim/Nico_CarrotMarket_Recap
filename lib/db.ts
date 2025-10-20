import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function test() {
    const token = await db.sMSToken.findMany({
       where: {
        id:1
       },
       include: {
        user: true
       }
    })
    console.log(token)
}

test()

// async function test() {
//   const user = await db.user.findMany({
//     where: {
//       username: {
//         contains: "est",
//       },
//     },
//   });
//   console.log(user);
// }

// test();

export default db;
