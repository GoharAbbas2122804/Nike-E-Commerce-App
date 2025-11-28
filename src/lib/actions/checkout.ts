"use server";

import { stripe } from "@/lib/stripe/client";
import { db } from "@/lib/db";
import { carts, cartItems, productVariants, products, productImages as images } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { guestSession } from "@/lib/auth/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createStripeCheckoutSession(cartId: string) {
  try {
    // 1. Validate User/Guest
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const guest = await guestSession();

    if (!session?.user && !guest) {
      throw new Error("Unauthorized");
    }

    // 2. Fetch Cart Items
    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
      with: {
        items: {
          with: {
            variant: {
              with: {
                product: {
                  with: {
                    images: true,
                  },
                },
                color: true,
                size: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // 3. Prepare Line Items
    const lineItems = cart.items.map((item) => {
      const product = item.variant.product;
      const image = product.images[0]?.url || "";
      
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: `${item.variant.color.name} - ${item.variant.size.name}`,
            images: image ? [image] : [],
          },
          unit_amount: Math.round(Number(item.variant.price) * 100), // Cents
        },
        quantity: item.quantity,
      };
    });

    // 4. Create Stripe Session
    const origin = (await headers()).get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: {
        cartId: cartId,
        userId: session?.user?.id || null,
        guestId: guest?.sessionToken || null,
      },
      customer_email: session?.user?.email,
    });

    return { url: checkoutSession.url };
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return { error: error.message };
  }
}
