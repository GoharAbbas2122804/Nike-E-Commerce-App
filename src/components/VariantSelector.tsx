"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useProductContext } from "./ProductContext";

interface VariantSelectorProps {
    variants: { id: string; color: { name: string; hex: string }; images: string[] }[];
}

export default function VariantSelector({
    variants,
}: VariantSelectorProps) {
    const { selectedVariantId, setSelectedVariantId, setSelectedImage } = useProductContext();

    if (!variants || variants.length === 0) return null;

    // Deduplicate variants by color to avoid showing same color multiple times if they exist
    // But usually variants are unique by color/size combination. 
    // Here we want to show COLOR swatches. 
    // If multiple variants have same color (but different sizes), we should group them or just pick one representative.
    // For simplicity, let's assume we show unique colors.
    const uniqueColorVariants = variants.reduce((acc, current) => {
        const x = acc.find(item => item.color.name === current.color.name);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, [] as typeof variants);

    const handleVariantClick = (variant: typeof variants[0]) => {
        setSelectedVariantId(variant.id);
        if (variant.images && variant.images.length > 0) {
            setSelectedImage(variant.images[0]);
        }
    };

    return (
        <div className="flex gap-2">
            {uniqueColorVariants.map((variant, idx) => {
                const isSelected = selectedVariantId === variant.id || (selectedVariantId === null && idx === 0 && false); // Logic for default selection if needed

                // Use the first image of the variant as the swatch image
                const swatchImage = variant.images[0];

                return (
                    <button
                        key={idx}
                        onClick={() => handleVariantClick(variant)}
                        className={cn(
                            "relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all hover:opacity-90",
                            isSelected
                                ? "border-black dark:border-white"
                                : "border-transparent"
                        )}
                        aria-label={`Select ${variant.color.name}`}
                        title={variant.color.name}
                    >
                        {swatchImage ? (
                            <Image
                                src={swatchImage}
                                alt={variant.color.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        ) : (
                            <div
                                className="w-full h-full"
                                style={{ backgroundColor: variant.color.hex || '#ccc' }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
