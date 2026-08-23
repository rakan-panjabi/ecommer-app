import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
    }
    const msg = await prisma.contactMessage.create({
      data: {
        name: body.name,
        email: body.email,
        subject: body.subject || "General Inquiry",
        message: body.message,
      },
    });
    return NextResponse.json(msg, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
