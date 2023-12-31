import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if(!session) {
    return NextResponse.json({error: "not authenticated"}, {status:401})
  }
  const { title, content, links, selectedCategory, imageUrl, publicId } =
    await req.json();

  const authorEmail = session?.user?.email as string;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and Content are required." },
      { status: 500 }
    );
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        links,
        imageUrl,
        publicId,
        catName: selectedCategory,
        authorEmail,
      },
    });
    console.log("Post Created");
    return NextResponse.json(newPost);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ message: "Could not create Post" });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
        include: { author: { select: { name: true } } },
        orderBy: {
          createdAt: 'desc',
        },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.log(error);

    return NextResponse.json("Something went wrong")
  }
}
