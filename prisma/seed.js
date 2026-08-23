const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const products = [
  {
    name: "Classic Leather Wallet",
    slug: "classic-leather-wallet",
    description:
      "Premium genuine leather wallet with multiple card slots and a coin pocket. Slim, durable, and stylish for everyday use.",
    price: 1290,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800",
    category: "Accessories",
    stock: 50,
    featured: true,
  },
  {
    name: "Wireless Bluetooth Headphones",
    slug: "wireless-bluetooth-headphones",
    description:
      "Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and deep bass sound.",
    price: 3450,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    category: "Electronics",
    stock: 30,
    featured: true,
  },
  {
    name: "Minimalist Analog Watch",
    slug: "minimalist-analog-watch",
    description:
      "A clean, minimalist analog watch with a stainless steel case and genuine leather strap.",
    price: 2150,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
    category: "Accessories",
    stock: 40,
    featured: true,
  },
  {
    name: "Everyday Canvas Backpack",
    slug: "everyday-canvas-backpack",
    description:
      "Spacious canvas backpack with a padded laptop compartment, perfect for work, travel, or college.",
    price: 1890,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    category: "Bags",
    stock: 25,
    featured: false,
  },
  {
    name: "Ceramic Pour-Over Coffee Set",
    slug: "ceramic-pour-over-coffee-set",
    description:
      "Hand-glazed ceramic pour-over coffee dripper with matching mug. Brew café-quality coffee at home.",
    price: 990,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    category: "Home",
    stock: 60,
    featured: false,
  },
  {
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description:
      "Compact waterproof speaker with punchy sound and 12-hour playtime — great for outdoor adventures.",
    price: 1650,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
    category: "Electronics",
    stock: 45,
    featured: true,
  },
];

async function main() {
  console.log("Seeding database...");
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
