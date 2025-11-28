"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: "sm" | "md" | "lg";
}

export default function StarRating({
    rating,
    onRatingChange,
    readonly = false,
    size = "md"
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8"
    };

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => !readonly && onRatingChange?.(star)}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(null)}
                    className={cn(
                        "transition-colors focus:outline-none",
                        readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"
                    )}
                >
                    <Star
                        className={cn(
                            sizeClasses[size],
                            (hoverRating !== null ? star <= hoverRating : star <= rating)
                                ? "fill-black text-black"
                                : "text-gray-300"
                        )}
                    />
                </button>
            ))}
        </div>
    );
}
