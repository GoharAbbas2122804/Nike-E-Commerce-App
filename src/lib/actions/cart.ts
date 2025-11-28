"use server";

import { db } from "@/lib/db";
import { carts, cartItems, productVariants, products } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";
import { guestSession, createGuestSession } from "@/lib/auth/actions";

// Helper to get current cart ID
async function getCartId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let cart;

  if (session?.user) {
    cart = await db.query.carts.findFirst({
      where: eq(carts.userId, session.user.id),
    });
  } else {
    const guest = await guestSession();
    if (guest) {
      cart = await db.query.carts.findFirst({
        where: eq(carts.guestId, guest.sessionToken),
      });
    }
  }

  return cart?.id;
}

// Helper to get or create cart
async function getOrCreateCart() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    let cart = await db.query.carts.findFirst({
      where: eq(carts.userId, session.user.id),
    });

    if (!cart) {
      [cart] = await db.insert(carts).values({ userId: session.user.id }).returning();
    }
    return cart;
  } else {
    let guest = await guestSession();
    
    if (!guest) {
      // Create a new guest session if none exists
      await createGuestSession();
      guest = await guestSession();
      
      if (!guest) {
        throw new Error("Failed to create guest session");
      }
    }

    let cart = await db.query.carts.findFirst({
      where: eq(carts.guestId, guest.sessionToken),
    });

    if (!cart) {
      [cart] = await db.insert(carts).values({ guestId: guest.sessionToken }).returning();
    }
    return cart;
  }
}

export async function getCart() {
  const cartId = await getCartId();

  if (!cartId) {
    return { items: [], subtotal: 0 };
  }

  const items = await db.query.cartItems.findMany({
    where: eq(cartItems.cartId, cartId),
    with: {
      variant: {
        with: {
          product: {
            with: {
              images: true,
              category: true,
              gender: true,
            }
          },
          color: true,
          size: true,
        },
      },
    },
  });

  const formattedItems = items.map((item) => ({
    id: item.id,
    variantId: item.productVariantId,
    productId: item.variant.productId,
    name: item.variant.product.name,
    price: Number(item.variant.price),
    salePrice: item.variant.salePrice ? Number(item.variant.salePrice) : null,
    image: item.variant.product.images[0]?.url || "/placeholder.png",
    color: item.variant.color.name,
    size: item.variant.size.name,
    quantity: item.quantity,
    maxStock: item.variant.inStock,
    category: item.variant.product.category.name,
    gender: item.variant.product.gender.label,
  }));

  const subtotal = formattedItems.reduce((acc, item) => {
    const price = item.salePrice || item.price;
    return acc + price * item.quantity;
  }, 0);

  return { items: formattedItems, subtotal };
}

export async function addCartItem(variantId: string, quantity: number) {
  try {
    const cart = await getOrCreateCart();

    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, cart.id),
        eq(cartItems.productVariantId, variantId)
      ),
    });

    if (existingItem) {
      await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      await db.insert(cartItems).values({
        cartId: cart.id,
        productVariantId: variantId,
        quantity,
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "Failed to add item to cart" };
  }
}

export async function updateCartItem(itemId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      await db.delete(cartItems).where(eq(cartItems.id, itemId));
    } else {
      await db
        .update(cartItems)
        .set({ quantity })
        .where(eq(cartItems.id, itemId));
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { success: false, error: "Failed to update cart item" };
  }
}

export async function removeCartItem(itemId: string) {
  try {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return { success: false, error: "Failed to remove cart item" };
  }
}

export async function clearCart() {
  try {
    const cartId = await getCartId();
    if (cartId) {
      await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    }
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}
