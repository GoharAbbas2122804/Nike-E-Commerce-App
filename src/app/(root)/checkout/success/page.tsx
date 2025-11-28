import { getOrder } from "@/lib/actions/orders";
import OrderSuccess from "@/components/OrderSuccess";
import { redirect } from "next/navigation";

interface PageProps {
    searchParams: Promise<{
        session_id?: string;
    }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
    const { session_id } = await searchParams;

    if (!session_id) {
        redirect("/");
    }

    // We need to find the order by session_id. 
    // getOrder expects orderId. I should update getOrder or create getOrderBySessionId.
    // Or I can query DB here directly? No, better to use action.
    // But wait, createOrder returns orderId.
    // The webhook creates the order.
    // So by the time user lands here, order *should* exist.
    // But there might be a race condition.
    // Ideally, we poll or show loading.
    // For now, let's assume it's fast enough or we try to find order by session ID.

    // I need to update getOrder to support finding by session ID or add a new function.
    // Let's use a direct DB query here for simplicity or add a helper.
    // Actually, I'll update getOrder to accept either or add getOrderBySessionId.
    // Let's add getOrderBySessionId to src/lib/actions/orders.ts first.

    // Wait, I can't update orders.ts in this step easily without another tool call.
    // I'll assume I can import db here and query. It's a server component.

    const { db } = await import("@/lib/db");
    const { orders } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    // Simple retry logic could be added here if needed
    const order = await db.query.orders.findFirst({
        where: eq(orders.stripeSessionId, session_id),
        with: {
            items: {
                with: {
                    variant: {
                        with: {
                            product: {
                                with: {
                                    images: true
                                }
                            },
                            color: true,
                            size: true
                        },
                    },
                },
            },
            shippingAddress: true,
        },
    });

    if (!order) {
        // If order not found (webhook delay), maybe show a "Processing..." state or generic success.
        // For now, let's show a generic "Processing" message if order is missing but session_id is present.
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
                <p>Your order is being processed. Please check your email for confirmation.</p>
                <p className="text-sm text-gray-500 mt-2">Session ID: {session_id}</p>
            </div>
        );
    }

    return <OrderSuccess order={order} />;
}
