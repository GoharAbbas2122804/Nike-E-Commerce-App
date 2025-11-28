import { getRecommendedProducts } from "@/lib/actions/product";
import Link from "next/link";
import Card from "./Card";

export default async function RelatedProductsSection({ productId }: { productId: string }) {
    const relatedProducts = await getRecommendedProducts(productId);

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <div className="mt-24 space-y-8">
            <h2 className="text-2xl font-medium">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedProducts.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`}>
                        <Card
                            image={product.image}
                            title={product.title}
                            category={product.category}
                            price={product.price}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
