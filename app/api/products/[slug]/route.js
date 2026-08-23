import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const product = await prisma.product.update({
      where: { slug: params.slug },
      data: body,
    });
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;

    // প্রথমে প্রোডাক্টটি খুঁজে নিন
    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // ১. প্রথমে এই প্রোডাক্ট সম্পর্কিত সব OrderItem ডিলিট করুন (যাতে ফরেন কি কনফ্লিক্ট না করে)
    await prisma.orderItem.deleteMany({
      where: { productId: product.id },
    });

    // ২. এবার নিরাপদে প্রোডাক্টটি ডিলিট করুন
    await prisma.product.delete({
      where: { id: product.id },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
