"use server";

import { db } from "@/lib/db";
import { reviews, user } from "@/lib/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth"; // Assuming auth is exported from here
import { headers } from "next/headers";

const createReviewSchema = z.object({
    productId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    title: z.string().optional(),
    comment: z.string().min(10, "Review must be at least 10 characters long").max(2000),
});

export async function createReview(prevState: any, formData: FormData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { error: "You must be logged in to write a review." };
        }

        const rawData = {
            productId: formData.get("productId"),
            rating: Number(formData.get("rating")),
            title: formData.get("title"),
            comment: formData.get("comment"),
        };

        const validatedData = createReviewSchema.parse(rawData);

        // Check if user already reviewed this product
        const existingReview = await db.query.reviews.findFirst({
            where: and(
                eq(reviews.productId, validatedData.productId),
                eq(reviews.userId, session.user.id)
            ),
        });

        if (existingReview) {
            return { error: "You have already reviewed this product." };
        }

        await db.insert(reviews).values({
            productId: validatedData.productId,
            userId: session.user.id,
            rating: validatedData.rating,
            title: validatedData.title as string,
            comment: validatedData.comment,
        });

        revalidatePath(`/products/${validatedData.productId}`);
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        console.error("Failed to create review:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function getReviews(productId: string, page: number = 1, limit: number = 5) {
    const offset = (page - 1) * limit;

    const data = await db.query.reviews.findMany({
        where: eq(reviews.productId, productId),
        with: {
            user: true,
        },
        orderBy: desc(reviews.createdAt),
        limit: limit,
        offset: offset,
    });

    const totalCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(reviews)
        .where(eq(reviews.productId, productId));
    
    const total = Number(totalCountResult[0]?.count || 0);
    const totalPages = Math.ceil(total / limit);

    return {
        reviews: data.map(r => ({
            id: r.id,
            author: r.user.name || "Anonymous",
            rating: r.rating,
            title: r.title || "",
            content: r.comment || "",
            createdAt: r.createdAt.toISOString(),
        })),
        metadata: {
            total,
            page,
            totalPages,
            hasMore: page < totalPages
        }
    };
}

export async function getReviewStats(productId: string) {
    const result = await db
        .select({
            averageRating: sql<number>`avg(${reviews.rating})`,
            totalReviews: sql<number>`count(*)`,
        })
        .from(reviews)
        .where(eq(reviews.productId, productId));

    const stats = result[0] || { averageRating: 0, totalReviews: 0 };

    return {
        averageRating: Number(stats.averageRating) || 0,
        totalReviews: Number(stats.totalReviews) || 0,
    };
}
