import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, undoTotal, undoYesterday, undoSevendaysum } = body;

    const post = await prisma.member.update({
      where: { id },
      data: {
        total: undoTotal,
        yesterday: undoYesterday,
        sevendaysum: undoSevendaysum,
        timeStamp: "0",
      },
    });
    return NextResponse.json(post);
  } catch (error: any) {
    console.log(error, "POST_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
