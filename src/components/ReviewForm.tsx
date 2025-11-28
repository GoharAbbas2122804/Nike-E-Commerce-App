"use client";

import { useState } from "react";
import { createReview } from "@/lib/actions/review";
import StarRating from "./StarRating";
import { Loader2 } from "lucide-react";

interface ReviewFormProps {
    productId: string;
    onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        formData.append("productId", productId);
        formData.append("rating", rating.toString());

        const result = await createReview(null, formData);

        setIsSubmitting(false);

        if (result?.error) {
            setError(result.error);
        } else {
            setRating(0);
            onSuccess?.();
            // Reset form
            const form = document.getElementById("review-form") as HTMLFormElement;
            form?.reset();
        }
    }

    return (
        <form id="review-form" action={handleSubmit} className="space-y-6 bg-gray-50 p-6 rounded-lg">
            <div className="space-y-2">
                <label className="block font-medium">Rating</label>
                <StarRating rating={rating} onRatingChange={setRating} size="lg" />
            </div>

            <div className="space-y-2">
                <label htmlFor="title" className="block font-medium">
                    Review Title
                </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Summarize your thoughts"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="comment" className="block font-medium">
                    Review
                </label>
                <textarea
                    name="comment"
                    id="comment"
                    required
                    rows={4}
                    placeholder="Share your experience with this product..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    minLength={10}
                    maxLength={2000}
                />
                <p className="text-xs text-gray-500 text-right">Min 10 characters</p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 rounded-md font-bold hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    "Submit Review"
                )}
            </button>
        </form>
    );
}
