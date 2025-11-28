import { getReviews, getReviewStats } from "@/lib/actions/review";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import StarRating from "./StarRating";

export default async function ReviewsSection({ productId }: { productId: string }) {
    const [reviewsData, stats, session] = await Promise.all([
        getReviews(productId),
        getReviewStats(productId),
        auth.api.getSession({ headers: await headers() })
    ]);

    return (
        <div className="space-y-10">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Reviews ({stats.totalReviews})</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <span className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</span>
                            <StarRating rating={Math.round(stats.averageRating)} readonly size="md" />
                        </div>
                        <p className="text-gray-500">Based on {stats.totalReviews} reviews</p>
                    </div>
                </div>

                {/* Write Review Button / Form Toggle could go here if using a modal */}
            </div>

            {/* Write Review Form */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold">Write a Review</h3>
                {session ? (
                    <ReviewForm productId={productId} />
                ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <p className="text-gray-600 mb-4">Please sign in to write a review.</p>
                        <a href="/sign-in" className="inline-block bg-black text-white px-6 py-2 rounded-md font-bold hover:bg-gray-800 transition-colors">
                            Sign In
                        </a>
                    </div>
                )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold">Customer Reviews</h3>
                {reviewsData.reviews.length > 0 ? (
                    <ReviewList
                        initialReviews={reviewsData.reviews}
                        productId={productId}
                        totalReviews={reviewsData.metadata.total}
                    />
                ) : (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </div>
    );
}
