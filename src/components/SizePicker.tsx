"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import SizeGuideModal from "./SizeGuideModal";

interface SizePickerProps {
    sizes: string[];
}

export default function SizePicker({ sizes }: SizePickerProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Select Size</span>
                <button
                    onClick={() => setIsGuideOpen(true)}
                    className="text-sm font-bold text-black border-b-2 border-transparent hover:border-black transition-all flex items-center gap-1"
                >
                    Size Guide
                </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                            "py-3 border rounded-md text-center transition-all duration-200 hover:border-black text-black",
                            selectedSize === size
                                ? "border-black border-2 font-bold"
                                : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        )}
                    >
                        {size}
                    </button>
                ))}
            </div>
            <SizeGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        </div>
    );
}
