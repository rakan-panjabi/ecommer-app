# Rakan — Small E-commerce Store

Full-stack e-commerce demo built with **Next.js (App Router)**, **Prisma**, and **PostgreSQL**.

## Features

- 🏠 Home page (featured products)
- 🛍️ Products page — dynamic, filter by category + search
- 📦 Single product page — dynamic route (`/products/[slug]`)
- ℹ️ About Us page
- 📩 Contact page — dynamic, saves messages to database
- 🛒 Add to cart (persisted in browser)
- 💳 Checkout — creates a real order in the database
- 📊 Admin dashboard — order management + monthly sales report (chart)

## 1. Install dependencies

```bash
npm install
```

## 2. Set up the database

### Option A — Local PostgreSQL

Create a database, then set `DATABASE_URL` in `.env`:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce"
```

### Option B — Neon (recommended, free tier)

1. Go to https://neon.tech and create a new project.
2. Copy the connection string from the dashboard (**Connection Details**).
3. Paste it into `.env` as `DATABASE_URL`:

```
DATABASE_URL="postgresql://user:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require"
```

Copy `.env.example` to `.env` first:

```bash
cp .env.example .env
```

## 3. Push the schema & seed sample products

```bash
npm run db:push
npm run db:seed
```

## 4. Run the dev server

```bash
npm run dev
```

Visit http://localhost:3000

## 5. Admin Dashboard

Go to http://localhost:3000/admin — login with the credentials from `.env`
(default: `admin@example.com` / `admin123`).

From the dashboard you can:

- View total revenue, total orders, average order value
- See a monthly sales chart (bar chart + table)
- Manage orders (view details, update status: Pending → Processing → Shipped → Delivered)
- Manage products (add / edit / delete)

## Project structure

```
app/
  page.js                    → Home
  products/page.js           → Product listing (dynamic)
  products/[slug]/page.js    → Single product (dynamic)
  about/page.js               → About us
  contact/page.js             → Contact form (dynamic)
  cart/page.js                → Cart
  checkout/page.js            → Checkout
  order-success/[id]/page.js  → Order confirmation
  admin/                       → Admin dashboard (protected)
  api/                         → All backend routes (products, orders, contact, sales)
prisma/
  schema.prisma                → Database models
  seed.js                       → Sample product data
lib/
  db.js                         → Prisma client
  cart-context.jsx              → Cart state (React Context)
components/                     → Reusable UI components
```

## Notes / Next steps

- Payment is currently "Cash on Delivery" — plug in Stripe / SSLCommerz / bKash when ready.
- Admin auth is a simple cookie check for demo purposes — swap in NextAuth for production.
- Product images use direct URLs — connect a CMS (Sanity/Contentful) or image upload (e.g. UploadThing/Cloudinary) later if needed.
- To deploy: push to GitHub, import into Vercel, set `DATABASE_URL`/`ADMIN_EMAIL`/`ADMIN_PASSWORD` as environment variables, then run `npm run db:push && npm run db:seed` once (e.g. via Vercel's build command or locally pointed at the Neon DB).
