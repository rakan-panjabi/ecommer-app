import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MONTH_NAMES } from "@/lib/utils";

// রাউটটিকে ডাইনামিক করার জন্য এটি আবশ্যিক
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // ইউআরএল থেকে কুয়েরি প্যারামিটার (যেমন: status বা date filter) ধরার ব্যবস্থা
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status"); // যেমন: DELIVERED, PENDING, CANCELLED ইত্যাদি

    // ডায়নামিক হোয়্যার ক্লজ (যদি ফিল্টার দেওয়া থাকে)
    const whereCondition = {};
    if (statusFilter && statusFilter !== "ALL") {
      whereCondition.status = statusFilter;
    }

    // ১. ফিল্টার অনুযায়ী অর্ডার ফেচ করা
    const orders = await prisma.order.findMany({
      where: whereCondition,
      select: { total: true, createdAt: true, status: true },
    });

    // ২. সার্বিক স্ট্যাটাসগুলোর কাউন্ট বের করার জন্য অল অর্ডার ফেচ করা (রেশিও ও সামারির জন্য)
    const allOrders = await prisma.order.findMany({
      select: { total: true, status: true },
    });

    // আলাদা আলাদা স্ট্যাটাসের হিসাব
    const totalOrdersCount = allOrders.length;
    const deliveredCount = allOrders.filter(
      (o) => o.status === "DELIVERED",
    ).length;
    const cancelledCount = allOrders.filter(
      (o) => o.status === "CANCELLED",
    ).length;
    const pendingCount = allOrders.filter((o) => o.status === "PENDING").length;

    // সাকসেস বা ফুলফিলমেন্ট রেশিও (Delivered vs Total Orders Percentage)
    const successRatio =
      totalOrdersCount > 0
        ? Math.round((deliveredCount / totalOrdersCount) * 100)
        : 0;

    // ৩. শুধুমাত্র সাকসেসফুল/ডেলিভারড অর্ডারগুলোর ভিত্তিতে রেভিনিউ হিসাব করার জন্য ফিল্টার (যদি চান)
    // অথবা বর্তমান ফিল্টার করা ডেটার ওপর ভিত্তি করে মান হিসাব করা:
    const activeOrders = orders.filter((o) => o.status !== "CANCELLED");

    // group by "YYYY-MM" (মাসভিত্তিক হিসাব)
    const map = {};
    for (const o of activeOrders) {
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map[key]) {
        map[key] = {
          key,
          year: d.getFullYear(),
          month: d.getMonth(),
          total: 0,
          orders: 0,
        };
      }
      map[key].total += o.total;
      map[key].orders += 1;
    }

    const monthly = Object.values(map)
      .sort((a, b) => (a.key > b.key ? 1 : -1))
      .map((m) => ({
        label: `${MONTH_NAMES[m.month]} ${m.year}`,
        total: Math.round(m.total),
        orders: m.orders,
      }));

    const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
    const filteredOrderCount = orders.length;
    const avgOrderValue =
      filteredOrderCount > 0 ? totalRevenue / filteredOrderCount : 0;

    return NextResponse.json({
      monthly,
      summary: {
        totalRevenue: Math.round(totalRevenue),
        totalOrders: totalOrdersCount,
        filteredOrdersCount: filteredOrderCount,
        deliveredOrders: deliveredCount,
        cancelledOrders: cancelledCount,
        pendingOrders: pendingCount,
        successRatio: `${successRatio}%`, // ডেলিভারি সাকসেস রেট বা রেশিও
        avgOrderValue: Math.round(avgOrderValue),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load sales and order analytics" },
      { status: 500 },
    );
  }
}
