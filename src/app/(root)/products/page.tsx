import Card from "@/components/Card";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import { getAllProducts } from "@/lib/actions/product";
import { parseFilterParams } from "@/lib/utils/query";

interface SearchParams {
    gender?: string;
    kids?: string;
    price?: string;
    sort?: string;
    search?: string;
    category?: string;
    brand?: string;
    color?: string;
    size?: string;
    page?: string;
    limit?: string;
    [key: string]: string | string[] | undefined;
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const filters = parseFilterParams(params);
    const { data: products, metadata } = await getAllProducts(filters);

    return (
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 py-4">
                <h1 className="text-2xl font-medium text-dark-900">
                    New ({metadata.total})
                </h1>
                <div className="flex items-center gap-4">
                    <div className="lg:hidden">
                        {/* Mobile Filter Trigger is inside Filters component */}
                    </div>
                    <div className="hidden lg:flex items-center gap-2 text-dark-900 font-medium cursor-pointer">
                        <span>Hide Filters</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                            />
                        </svg>
                    </div>
                    <Sort />
                </div>
            </div>

            <div className="flex gap-12">
                {/* Filters Sidebar */}
                <Filters />

                {/* Product Grid */}
                <div className="flex-1">
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                            {products.map((product) => (
                                <Card
                                    key={product.id}
                                    image={product.image || "/placeholder.png"} // Fallback image
                                    title={product.name}
                                    category={product.category || "General"}
                                    price={product.price || 0}
                                    label={undefined} // Logic for labels like "Just In" can be added later
                                    colors={`${product.colorCount} Color${product.colorCount !== 1 ? 's' : ''}`}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h3 className="text-xl font-medium text-dark-900 mb-2">
                                No products found
                            </h3>
                            <p className="text-dark-700">
                                Try changing your filters to see more results.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
