import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";


const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin']
})


export const metadata: Metadata = {
  title: {
    template: "%s | Nike Shoes Platform",
    default: "Nike Shoes Platform - Just Do It",
  },
  description: "Discover the latest Nike shoes, sneakers, and athletic gear. Shop the best collection of Nike footwear for men, women, and kids.",
  keywords: ["Nike", "Shoes", "Sneakers", "Running", "Basketball", "Sportswear"],
  authors: [{ name: "Nike E-Commerce App" }],
  creator: "Nike E-Commerce App",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nike-e-commerce-app.vercel.app",
    title: "Nike Shoes Platform - Just Do It",
    description: "Discover the latest Nike shoes, sneakers, and athletic gear.",
    siteName: "Nike Shoes Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nike Shoes Platform - Just Do It",
    description: "Discover the latest Nike shoes, sneakers, and athletic gear.",
    creator: "@nike",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className={`${jost.className} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
