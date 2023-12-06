import ListOfMembers from "./components/ListOfMembers";
import prisma from "@/app/libs/prismadb";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekday from "dayjs/plugin/weekday";
import { Suspense } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);

let date = dayjs(new Date()).tz("Asia/Taipei");

export const revalidate = 0;

async function getTimeStamp() {
  const res = await prisma.reset.findMany();
  if (res.length) {
    if (
      dayjs().weekday(2).format("YYYY-MM-DD") !== res[0].timeStamp &&
      dayjs().day() !== 0
    ) {
      await prisma.member.updateMany({
        where: {},
        data: {
          sevendaysum: 0,
          undoSevendaysum: 0,
        },
      });
      await prisma.reset.updateMany({
        where: {},
        data: {
          timeStamp: dayjs().weekday(2).format("YYYY-MM-DD"),
        },
      });
    }
  } else {
    await prisma.reset.create({
      data: {
        timeStamp: dayjs().weekday(2).format("YYYY-MM-DD"),
      },
    });
  }
  return null;
}

async function getMember() {
  const res = await prisma.member.findMany({
    orderBy: {
      total: "desc",
    },
  });

  return res;
}

export async function Members() {
  const member = await getMember();
  return <ListOfMembers members={member} />;
}

export default async function Home() {
  return (
    <>
      <Suspense fallback={<div>Loading data...</div>}>
        <Members />
      </Suspense>
    </>
  );
}
