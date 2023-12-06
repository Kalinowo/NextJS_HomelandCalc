import prisma from "@/app/libs/prismadb";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekday from "dayjs/plugin/weekday";
import { Suspense } from "react";

import Members from "./components/Member";

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

export default async function Home() {
  const timeStamp = await getTimeStamp();
  return (
    <>
      <Suspense fallback={<div>Loading data...</div>}>
        <Members />
      </Suspense>
    </>
  );
}
