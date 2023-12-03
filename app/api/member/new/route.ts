import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, family, total, yesterday } = body;
    const post = await prisma.member.create({
      data: {
        name,
        family,
        total,
        yesterday,
      },
    });
    console.log(post);
    return NextResponse.json(post);
  } catch (error: any) {
    console.log(error, "POST_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
