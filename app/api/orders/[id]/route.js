import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: { include: { product: true } } },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status: body.status },
    });
    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
