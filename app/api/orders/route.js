import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const where = {};
  if (status && status !== "all") where.status = status;

  try {
    // এক সাথে ডাটা ফেচ এবং মোট কাউন্ট বের করা
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, email, phone, address, city, items } = body;

    if (!customerName || !email || !phone || !address || !city) {
      return NextResponse.json(
        { error: "All customer fields are required" },
        { status: 400 },
      );
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // ১. সম্পূর্ণ অর্ডার প্রসেসটি একটি ট্রানজাকশনের ভেতর নিয়ে আসা হলো
    const order = await prisma.$transaction(async (tx) => {
      // প্রোডাক্টগুলোর লেটেস্ট ডেটা (স্টকসহ) ফেচ করা
      const productIds = items.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      let total = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);

        // ২. স্টক চেক: অর্ডারের পরিমাণ বর্তমান স্টকের চেয়ে বেশি কি না যাচাই করা
        if (product.stock < item.quantity) {
          throw new Error(
            `Sorry, "${product.name}" has only ${product.stock} items left in stock.`,
          );
        }

        total += product.price * item.quantity;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // ৩. অর্ডার ক্রিয়েট করা
      const newOrder = await tx.order.create({
        data: {
          customerName,
          email,
          phone,
          address,
          city,
          total,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });

      // ৪. স্টক নিরাপদে ডিক্রিমেন্ট করা
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error(err);
    // এরর মেসেজ ক্লায়েন্টে পাঠানোর ব্যবস্থা যাতে ইউজার সঠিক কারণ দেখতে পায়
    return NextResponse.json(
      { error: err.message || "Failed to place order" },
      { status: 400 },
    );
  }
}
