import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";


const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin']
})


export const metadata: Metadata = {
  title: "Nike Shoes Platform",
  description: "Buy best Nike Shoes from best Website",
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
