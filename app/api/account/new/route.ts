import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, hashedPassword } = body;
    const post = await prisma.user.create({
      data: {
        name,
        hashedPassword: await hash(hashedPassword, 12),
      },
    });
    return NextResponse.json(post);
  } catch (error: any) {
    console.log(error, "POST_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
