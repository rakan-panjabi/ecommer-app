import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getOrder(id) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
}

// স্ট্যাটাস অনুযায়ী কালার ক্লাসেস রিটার্ন করার ফাংশন
function getStatusBadge(status) {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "PROCESSING":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "SHIPPED":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

export default async function OrderSuccessPage({ params }) {
  const resolvedParams = await params;
  const order = await getOrder(resolvedParams.id);
  if (!order) notFound();

  // সাবটোটাল হিসাব করা
  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingCost = order.total - subtotal > 0 ? order.total - subtotal : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ">
      {/* Success Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl sm:text-4xl shadow-sm">
          ✓
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-slate-500 mt-2 text-sm sm:text-base px-2">
          Thank you,{" "}
          <strong className="text-slate-800">{order.customerName}</strong>! We
          have received your order and are processing it.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 sm:space-y-8">
        {/* Order Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 pb-6 border-b border-slate-100 gap-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Order ID
            </p>
            <p className="font-mono font-bold text-slate-900 text-xs sm:text-sm mt-0.5 break-all">
              {order.id}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Order Date
            </p>
            <p className="font-medium text-slate-700 mt-0.5">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Status
            </p>
            <span
              className={`inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full border uppercase ${getStatusBadge(
                order.status,
              )}`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* Ordered Items with Images */}
        <div>
          <h2 className="font-bold text-slate-900 text-base sm:text-lg mb-4">
            Ordered Items
          </h2>
          <div className="space-y-4 divide-y divide-slate-50">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 first:pt-0 gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  {/* Product Image */}
                  <div className="relative w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                    {item.product?.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-800 text-sm md:text-base truncate">
                      {item.product?.name || "Product Name"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                {/* Total Price for item */}
                <div className="flex justify-between sm:justify-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                  <span className="text-xs text-slate-500 sm:hidden">
                    Total:
                  </span>
                  <span className="font-bold text-slate-900 text-sm md:text-base">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Summary Breakdown */}
        <div className="border-t border-slate-100 pt-6 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-medium text-slate-900">
              {formatPrice(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Shipping Cost (Cash on Delivery)</span>
            <span className="font-medium text-slate-900">
              {formatPrice(shippingCost)}
            </span>
          </div>
          <div className="flex justify-between font-extrabold text-lg text-slate-900 pt-3 border-t border-slate-100">
            <span>Total Payable</span>
            <span className="text-slate-900">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
            Delivery Information
          </h3>
          <div className="text-sm space-y-1 text-slate-600">
            <p className="font-semibold text-slate-900 text-base">
              {order.customerName}
            </p>
            <p className="break-words">
              {order.address}, {order.city}
            </p>
            <p className="pt-1 text-slate-500 text-xs sm:text-sm">
              📞 {order.phone} &nbsp;·&nbsp; ✉️ {order.email}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center mt-8">
        <Link
          href="/products"
          className="inline-block w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl font-semibold text-sm shadow-md hover:bg-slate-800 transition-all text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
