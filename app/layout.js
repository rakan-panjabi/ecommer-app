import "./globals.css";
import "./custom.css";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import GlobalLoader from "@/components/GlobalLoader";
import PageTransition from "@/components/PageTransition";
import Providers from "./providers";

export const metadata = {
  metadataBase: new URL("https://rakan-panjabi.com" || "https://rakan.com.bd"),

  title: {
    default: "Rakan — Premium Online Store",
    template: "%s | Rakan",
  },
  description:
    "Shop the best products at Rakan. A premium full-stack e-commerce experience built for seamless online shopping.",
  authors: [{ name: "3rudit3" }],
  creator: "3rudit3",
  keywords: [
    "e-commerce",
    "online store",
    "Rakan",
    "shopping",
    "buy online",
    "Rakan store",
  ],

  openGraph: {
    title: "Rakan — Premium Online Store",
    description:
      "Shop the best products at Rakan. A premium full-stack e-commerce experience built for seamless online shopping.",
    url: "/",
    siteName: "Rakan",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rakan Storefront",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Rakan — Premium Online Store",
    description:
      "Shop the best products at Rakan. A premium full-stack e-commerce experience.",
    creator: "@3rudit3",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 relative">
        <Providers>
          <GlobalLoader />
          <PageTransition>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }}
            />
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </PageTransition>
        </Providers>
      </body>
    </html>
  );
}
