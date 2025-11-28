import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Heart, Star } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import SizePicker from "@/components/SizePicker";
import CollapsibleSection from "@/components/CollapsibleSection";
import VariantSelector from "@/components/VariantSelector";
import { ProductProvider } from "@/components/ProductContext";
import ReviewsSection from "@/components/ReviewsSection";
import RelatedProductsSection from "@/components/RelatedProductsSection";
import { getProduct } from "@/lib/actions/product";
import { cn } from "@/lib/utils";
import AddToBagButton from "@/components/AddToBagButton";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: "Product Not Found | Nike",
        };
    }

    return {
        title: `${product.name} | Nike`,
        description: product.description,
    };
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h1 className="text-2xl font-bold">Product Not Found</h1>
                <p className="text-gray-500">The product you are looking for does not exist.</p>
                <Link href="/" className="text-blue-600 hover:underline">
                    Back to Home
                </Link>
            </div>
        );
    }

    // Extract unique sizes from variants
    const uniqueSizes = Array.from(
        new Set(product.variants.map((v) => v.size.name))
    ).sort((a, b) => {
        // Try to sort numerically if possible
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
    });

    // Calculate min price for display
    const minPrice = Math.min(...product.variants.map((v) => Number(v.price)));
    const minSalePrice = Math.min(
        ...product.variants
            .filter((v) => v.salePrice)
            .map((v) => Number(v.salePrice))
    );
    const hasDiscount = minSalePrice < minPrice && minSalePrice !== Infinity;
    const displayPrice = hasDiscount ? minSalePrice : minPrice;

    // Prepare variants for selector
    const variantsForSelector = product.variants.map((v) => ({
        id: v.id,
        color: {
            name: v.color.name,
            hex: v.color.hexCode,
        },
        images: v.images,
        name: v.color.name, // For aria-label
    }));

    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
            <ProductProvider
                initialImage={product.defaultImages[0] || product.variants[0]?.images[0] || null}
                initialVariantId={null}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Left Column - Gallery */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <ProductGallery
                            defaultImages={product.defaultImages}
                            variants={product.variants.map(v => ({ id: v.id, images: v.images }))}
                        />
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
                        {/* Header */}
                        <div className="space-y-2">
                            <h1 className="text-2xl lg:text-3xl font-medium text-dark-900">
                                {product.name}
                            </h1>
                            <p className="text-dark-900 font-medium">{product.category.name}</p>
                            <div className="flex flex-col gap-1 mt-2">
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-medium">$ {displayPrice.toFixed(2)}</p>
                                    {hasDiscount && (
                                        <p className="text-gray-500 line-through text-sm">
                                            $ {minPrice.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                                {hasDiscount && (
                                    <p className="text-green-700 font-medium text-sm">
                                        Discount Available
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Variants */}
                        <div className="space-y-4">
                            <VariantSelector variants={variantsForSelector} />
                        </div>

                        {/* Size Picker */}
                        <div className="space-y-4">
                            <SizePicker sizes={uniqueSizes} />
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-4">
                            <AddToBagButton />
                            <button className="w-full bg-white text-black border border-black py-4 rounded-md font-bold flex items-center justify-center gap-2 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-in-out">
                                <Heart className="w-5 h-5" />
                                Favorite
                            </button>
                        </div>

                        {/* Collapsible Sections */}
                        <div className="pt-8 space-y-2">
                            <CollapsibleSection title="Product Details" defaultOpen={true}>
                                <div className="space-y-4">
                                    <p>{product.description}</p>
                                </div>
                            </CollapsibleSection>

                            <CollapsibleSection title="Shipping & Returns">
                                <p>
                                    Free standard shipping on orders over $50. Returns are free for
                                    Nike Members.
                                </p>
                            </CollapsibleSection>

                            <CollapsibleSection title="Reviews">
                                <Suspense fallback={<div className="h-20 animate-pulse bg-gray-100 rounded" />}>
                                    <ReviewsSection productId={product.id} />
                                </Suspense>
                            </CollapsibleSection>
                        </div>
                    </div>
                </div>
            </ProductProvider>

            {/* You Might Also Like */}
            <Suspense fallback={<div className="mt-24 h-64 animate-pulse bg-gray-100 rounded" />}>
                <RelatedProductsSection productId={product.id} />
            </Suspense>
        </div>
    );
}
