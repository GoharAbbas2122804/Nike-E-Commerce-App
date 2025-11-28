"use server";

import { db } from "@/lib/db";
import { orders, orderItems, carts, cartItems, productVariants, addresses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe/client";

export async function createOrder(stripeSessionId: string) {
  try {
    // 1. Retrieve Session
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
    if (!session) throw new Error("Session not found");

    const cartId = session.metadata?.cartId;
    const userId = session.metadata?.userId;
    const guestId = session.metadata?.guestId;

    if (!cartId) throw new Error("Cart ID missing in metadata");

    // 2. Check if order already exists (idempotency)
    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.stripeSessionId, stripeSessionId),
    });

    if (existingOrder) return { orderId: existingOrder.id };

    // 3. Get Cart Items
    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
      with: {
        items: {
          with: {
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) throw new Error("Cart not found or empty");

    // 4. Create Order
    // For now, we'll use a placeholder address or fetch from session if we collected it.
    // Since we didn't implement address collection in the plan, we'll assume the user has a default address 
    // OR we should have collected it in checkout. 
    // Stripe collects address. We can extract it.
    // For simplicity in this task, I'll assume we use a dummy address ID or create one from Stripe data.
    // Let's create a dummy address for now or try to find one.
    // Ideally, we should parse session.shipping_details and create an address.
    
    // Let's try to find a default address for the user, or create a new one from Stripe data.
    let shippingAddressId: string;
    let billingAddressId: string;

    // Quick fix: Create a temporary address from Stripe data
    const shippingDetails = (session as any).shipping_details;
    const addressData = {
        userId: userId || null, // Allow null for guest
        type: "shipping" as const,
        line1: shippingDetails?.address?.line1 || "N/A",
        line2: shippingDetails?.address?.line2 || null,
        city: shippingDetails?.address?.city || "N/A",
        state: shippingDetails?.address?.state || "N/A",
        country: shippingDetails?.address?.country || "N/A",
        postalCode: shippingDetails?.address?.postal_code || "N/A",
        isDefault: false,
    };

    const [newAddress] = await db.insert(addresses).values(addressData).returning();
    shippingAddressId = newAddress.id;
    billingAddressId = newAddress.id; // Use same for billing for now

    const [newOrder] = await db.insert(orders).values({
      userId: userId || null, // Allow null
      stripeSessionId: stripeSessionId,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      status: "paid", // Assuming successful payment
      totalAmount: (session.amount_total! / 100).toString(),
      shippingAddressId,
      billingAddressId,
    }).returning();

    // 5. Create Order Items
    const orderItemsData = cart.items.map((item) => ({
      orderId: newOrder.id,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      priceAtPurchase: item.variant.price,
    }));

    await db.insert(orderItems).values(orderItemsData);

    // 6. Clear Cart
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    await db.delete(carts).where(eq(carts.id, cartId));

    return { orderId: newOrder.id };
  } catch (error: any) {
    console.error("Create Order Error:", error);
    return { error: error.message };
  }
}

export async function getOrder(orderId: string) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
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
              },
            },
          },
        },
        shippingAddress: true,
      },
    });

    return order;
  } catch (error) {
    console.error("Get Order Error:", error);
    return null;
  }
}
