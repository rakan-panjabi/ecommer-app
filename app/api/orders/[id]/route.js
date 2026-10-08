import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ১. নির্দিষ্ট অর্ডারের তথ্য ফেচ করার জন্য GET মেথড
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true, // প্রোডাক্টের নাম ও ইমেজ পাওয়ার জন্য
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch order details:", err);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 },
    );
  }
}

// ২. অর্ডারের স্ট্যাটাস আপডেট এবং স্টক ম্যানেজ করার জন্য PATCH মেথড
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const oldStatus = existingOrder.status;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // স্টক কেইস ১: অর্ডার DELIVERED হলে স্টক কমবে
      if (status === "DELIVERED" && oldStatus !== "DELIVERED") {
        for (const item of existingOrder.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });
          if (product && product.stock < item.quantity) {
            throw new Error(`Not enough stock for "${product.name}".`);
          }

          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // স্টক কেইস ২: ডেলিভারড অর্ডার RETURNED, REFUNDED বা CANCELLED হলে স্টক ব্যাক আসবে
      if (
        oldStatus === "DELIVERED" &&
        (status === "RETURNED" ||
          status === "REFUNDED" ||
          status === "CANCELLED")
      ) {
        for (const item of existingOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      const order = await tx.order.update({
        where: { id },
        data: { status },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      return order;
    });

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Failed to update order status" },
      { status: 400 },
    );
  }
}
