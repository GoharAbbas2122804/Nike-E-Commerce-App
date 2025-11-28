"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductContext } from "./ProductContext";

interface ProductGalleryProps {
    defaultImages: string[];
    variants: { id: string; images: string[] }[];
}

export default function ProductGallery({ defaultImages, variants }: ProductGalleryProps) {
    const { selectedImage, setSelectedImage, selectedVariantId } = useProductContext();
    const [imageError, setImageError] = useState(false);

    // Determine which images to show based on selected variant
    const currentImages = selectedVariantId
        ? variants.find(v => v.id === selectedVariantId)?.images || defaultImages
        : defaultImages;

    const validImages = currentImages.filter((img) => img && img.trim() !== "");

    useEffect(() => {
        // If the selected image is not in the current set of valid images (e.g. after variant switch),
        // reset to the first valid image.
        if (validImages.length > 0 && (!selectedImage || !validImages.includes(selectedImage))) {
            setSelectedImage(validImages[0]);
        }
    }, [validImages, selectedImage, setSelectedImage]);

    const handleThumbnailClick = (img: string) => {
        setSelectedImage(img);
        setImageError(false);
    };

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:h-[600px] no-scrollbar py-2 md:py-0">
                {validImages.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleThumbnailClick(img)}
                        className={cn(
                            "relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 border-2 rounded-md overflow-hidden transition-all",
                            selectedImage === img
                                ? "border-black dark:border-white opacity-100"
                                : "border-transparent opacity-70 hover:opacity-100"
                        )}
                        aria-label={`View image ${idx + 1}`}
                    >
                        <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 64px, 80px"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 aspect-square md:aspect-auto md:h-[600px] bg-[#f5f5f5] rounded-xl overflow-hidden group">
                {selectedImage && !imageError ? (
                    <Image
                        src={selectedImage}
                        alt="Product Main"
                        fill
                        className="object-contain mix-blend-multiply p-4 transition-transform duration-300 group-hover:scale-105"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                        <ImageOff className="w-16 h-16 mb-2" />
                        <span className="text-sm">Image not available</span>
                    </div>
                )}
            </div>
        </div>
    );
}
