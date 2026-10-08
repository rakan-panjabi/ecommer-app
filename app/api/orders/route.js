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

    // অর্ডার করার সময় স্টক চেক বা কমানো হবে না, সরাসরি টোটাল হিসাব করে অর্ডার ক্রিয়েট হবে
    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) throw new Error(`Product ${item.productId} not found`);

      total += product.price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const newOrder = await prisma.order.create({
      data: {
        customerName,
        email,
        phone,
        address,
        city,
        total,
        status: "PENDING", // ডিফল্ট স্ট্যাটাস
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Failed to place order" },
      { status: 400 },
    );
  }
}
