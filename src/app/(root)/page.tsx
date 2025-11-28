import Link from "next/link";
import Card from "@/components/Card";
import HeroSection from "@/components/HeroSection";
import { getAllProducts } from "@/lib/actions/product";

export default async function Home() {
  const { data: products } = await getAllProducts({
    page: 1,
    limit: 9,
    sort: "createdAt.desc"
  });

  return (
    <main className="font-jost pb-24">
      {/* Hero Section */}
      <HeroSection />

      {/* Product Grid */}
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-dark-900">Best of Air Max</h2>
          <div className="flex gap-2">
            <button className="p-3 bg-light-200 rounded-full hover:bg-light-300 disabled:opacity-50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="p-3 bg-light-200 rounded-full hover:bg-light-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card
                image={product.image || "/placeholder.png"}
                title={product.name}
                category={product.category || "Shoes"}
                price={product.price || 0}
                label={product.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? "Just In" : undefined}
                colors={`${product.colorCount} Colour${product.colorCount !== 1 ? 's' : ''}`}
              />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}