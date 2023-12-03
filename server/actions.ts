"use server";
import prisma from "@/app/libs/prismadb";
import { revalidatePath } from "next/cache";

export async function addMember(formData: FormData) {
  const memberName = formData.get("name");
  const memberFamily = formData.get("family");
  const memberTotal = formData.get("total");
  const memberYesterday = formData.get("yesterday");
  const member = await prisma?.member.create({
    data: {
      name: memberName as string,
      family: memberFamily as string,
      total: Number(memberTotal),
      yesterday: Number(memberYesterday),
    },
  });
  revalidatePath("/", "layout");
}

export async function renewYesterdayPoint(formData: FormData) {
  const yesterdayPoint = formData.get("yesterdayPoint");
  const id = formData.get("id");
  const undoTotal = formData.get("undoTotal");
  const undoYesterday = formData.get("undoYesterday");
  const undoSevendaysum = formData.get("undoSevendaysum");
  const timeStamp = formData.get("timeStamp");

  let yesterday = Number(yesterdayPoint);
  let total = yesterday + Number(undoTotal);
  let sevendaysum = yesterday + Number(undoSevendaysum);

  const renewYesterday = await prisma?.member.update({
    where: {
      id: id as string,
    },
    data: {
      total,
      yesterday,
      sevendaysum,
      undoYesterday: Number(undoYesterday),
      undoTotal: Number(undoTotal),
      timeStamp: timeStamp as string,
    },
  });
  revalidatePath("/", "layout");
}

export async function undoPoint(formData: FormData) {
  const id = formData.get("id");
  const undoTodo = formData.get("undoTodo");
  const undoYesterday = formData.get("undoYesterday");
  const undoSevendaysum = formData.get("undoSevendaysum");

  const undoBtn = await prisma?.member.update({
    where: { id: id as string },
    data: {
      total: Number(undoTodo),
      yesterday: Number(undoYesterday),
      sevendaysum: Number(undoSevendaysum),
      timeStamp: "0",
    },
  });
  revalidatePath("/", "layout");
}

export async function removeMember(formData: FormData) {
  const id = formData.get("id");
  const removeBtn = await prisma?.member.delete({
    where: {
      id: id as string,
    },
  });
  revalidatePath("/", "layout");
}
