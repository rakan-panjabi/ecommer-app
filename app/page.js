import { prisma } from "@/lib/db";
import HeroSlider from "@/components/HeroSlider";
import FeaturedProducts from "@/components/FeaturedProducts";
import ValueProps from "@/components/ValueProps";
import CategorySliderSection from "@/components/CategorySliderSection"; 

export const revalidate = 60;

async function getHomeData() {
  try {
    const allProducts = await prisma.product.findMany({
      take: 60,
      orderBy: { createdAt: "desc" },
    });

    const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 10);

    const categoryMap = {};

    allProducts.forEach((product) => {
      if (!product.category) return;

      if (!categoryMap[product.category]) {
        categoryMap[product.category] = [];
      }

      if (categoryMap[product.category].length < 8) {
        categoryMap[product.category].push(product);
      }
    });

    // ক্যাটেগরিগুলোকে A থেকে Z ক্রমানুসারে সর্ট করা
    const validCategorySections = Object.entries(categoryMap)
      .map(([category, products]) => ({
        category,
        products,
      }))
      .sort((a, b) => a.category.localeCompare(b.category));

    return {
      featuredProducts,
      validCategorySections,
    };
  } catch (error) {
    console.error("Failed to fetch home data:", error);
    return { featuredProducts: [], validCategorySections: [] };
  }
}

export default async function HomePage() {
  const { featuredProducts, validCategorySections } = await getHomeData();

  return (
    <div className="bg-white">
      {/* হিরো স্লাইডার */}
      <HeroSlider />

      {/* ফিচারড প্রোডাক্টস সেকশন */}
      {featuredProducts.length > 0 && (
        <FeaturedProducts products={featuredProducts} />
      )}

      {/* ক্যাটেগরি অনুযায়ী স্লাইডার সেকশন */}
      {validCategorySections.map(({ category, products }) => (
        <CategorySliderSection
          key={category}
          category={category}
          products={products}
        />
      ))}

      {/* ভ্যালু প্রপস */}
      <ValueProps />
    </div>
  );
}
