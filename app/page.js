import { prisma } from "@/lib/db";
import HeroSlider from "@/components/HeroSlider";
import FeaturedProducts from "@/components/FeaturedProducts";
import ValueProps from "@/components/ValueProps";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true },
    take: 10, 
    orderBy: { createdAt: "desc" },
  });
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div className="min-h-screen bg-white">
      <HeroSlider />
      <FeaturedProducts products={featured} />
      <ValueProps />
    </div>
  );
}
