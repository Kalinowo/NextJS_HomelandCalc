import prisma from "@/app/libs/prismadb";
import ListOfMembers from "./ListOfMembers";
import { generateTimeStamp } from "@/server/weeklyreset";

async function getTimeStamp() {
  const res = await prisma.reset.findMany();
  if (!res.length) {
    await generateTimeStamp();
  }

  return res;
}

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
  const timeStamp = await getTimeStamp();

  return <ListOfMembers members={member} timeStamp={timeStamp} />;
}
