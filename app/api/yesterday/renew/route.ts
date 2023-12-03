import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      total,
      yesterday,
      sevendaysum,
      undoYesterday,
      undoTotal,
      timeStamp,
    } = body;
    const post = await prisma.member.update({
      where: { id },
      data: {
        total,
        yesterday,
        sevendaysum,
        undoYesterday,
        undoTotal,
        timeStamp,
      },
    });
    return NextResponse.json(post);
  } catch (error: any) {
    console.log(error, "POST_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
