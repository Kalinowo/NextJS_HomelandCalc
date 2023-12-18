"use server";
import prisma from "@/app/libs/prismadb";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekday from "dayjs/plugin/weekday";
import { revalidatePath } from "next/cache";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);

let date = dayjs(new Date()).tz("Asia/Taipei");

export async function weeklyReset(timeStamp: string) {
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
  revalidatePath("/", "layout");
}

export async function generateTimeStamp() {
  await prisma.reset.create({
    data: {
      timeStamp: dayjs().weekday(2).format("YYYY-MM-DD"),
    },
  });
  revalidatePath("/", "layout");
}
