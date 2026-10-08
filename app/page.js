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

    const validCategorySections = Object.entries(categoryMap)
      .map(([category, products]) => ({
        category,
        products,
      }))
      .sort((a, b) => a.category.localeCompare(b.category));

    // Prothom 5ta category hero section-er jonno (Index 0 theke 4)
    const heroCategories = validCategorySections.slice(0, 5);

    return {
      featuredProducts,
      validCategorySections,
      heroCategories,
    };
  } catch (error) {
    console.error("Failed to fetch home data:", error);
    return {
      featuredProducts: [],
      validCategorySections: [],
      heroCategories: [],
    };
  }
}

export default async function HomePage() {
  const { featuredProducts, validCategorySections, heroCategories } =
    await getHomeData();

  return (
    <div className="bg-white">
      {/* 5ta category props akare pass kora holo */}
      <HeroSlider categories={heroCategories} />

      {featuredProducts.length > 0 && (
        <FeaturedProducts products={featuredProducts} />
      )}

      {validCategorySections.map(({ category, products }) => (
        <CategorySliderSection
          key={category}
          category={category}
          products={products}
        />
      ))}

      <ValueProps />
    </div>
  );
}
