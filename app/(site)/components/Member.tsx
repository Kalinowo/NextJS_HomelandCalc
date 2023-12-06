import prisma from "@/app/libs/prismadb";
import ListOfMembers from "./ListOfMembers";

async function getMember() {
  const res = await prisma.member.findMany({
    orderBy: {
      total: "desc",
    },
  });

  return res;
}

export default async function Members() {
  const member = await getMember();
  return <ListOfMembers members={member} />;
}
