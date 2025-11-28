import Card from "@/components/Card";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import { mockProducts } from "@/lib/mock-data";

interface SearchParams {
    gender?: string;
    kids?: string;
    price?: string;
    sort?: string;
    [key: string]: string | string[] | undefined;
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const { gender, kids, price, sort } = params;

    // Filter Logic
    let filteredProducts = [...mockProducts];

    if (gender) {
        const genders = gender.split(",");
        filteredProducts = filteredProducts.filter((product) =>
            genders.includes(product.gender)
        );
    }

    if (kids) {
        // Assuming kids products might have a 'kids' gender or specific category logic
        // For now, let's assume 'kids' gender in mock data if we had it, 
        // or we can filter by category if needed. 
        // Given the mock data structure, let's filter by gender 'boys' or 'girls' if they existed
        // But mock data only has men/women. Let's just filter by gender for now.
        // If we add kids to mock data, we'd filter here.
        // For this demo, I'll check if gender matches 'boys' or 'girls'
        const kidGenders = kids.split(",");
        filteredProducts = filteredProducts.filter((product) =>
            kidGenders.includes(product.gender)
        );
    }

    if (price) {
        const priceRanges = price.split(",");
        filteredProducts = filteredProducts.filter((product) => {
            return priceRanges.some((range) => {
                const [min, max] = range.split("-").map(Number);
                return product.price >= min && product.price <= max;
            });
        });
    }

    // Sort Logic
    if (sort) {
        switch (sort) {
            case "price-asc":
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case "newest":
                // Mock logic for newest - just reverse or random shuffle for demo
                // In real app, sort by created_at
                filteredProducts.reverse();
                break;
            case "featured":
            default:
                // Default order
                break;
        }
    }

    return (
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 py-4">
                <h1 className="text-2xl font-medium text-dark-900">
                    New ({filteredProducts.length})
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
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                            {filteredProducts.map((product) => (
                                <Card
                                    key={product.id}
                                    image={product.image}
                                    title={product.name}
                                    category={product.category}
                                    price={product.price}
                                    label={product.label}
                                    colors={product.colors}
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
