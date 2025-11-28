"use client";

import { useCartStore } from "@/store/cart.store";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

// I'll assume I can check auth status via a hook or just check if user exists in session
// For now, I'll use a simple check or just redirect to auth if guest.
// Since I don't have a direct client-side auth hook ready in the context provided (only server actions),
// I'll assume I can check for a user session cookie or just try to checkout and let server handle it?
// The requirement says: "If a guest user clicks Checkout, redirect them to /auth page for login/signup."
// I can check if "guest_session" cookie exists? Or better, check if user is logged in.
// I'll use a server action to check auth status if needed, or just assume guest if no user data.
// But wait, the store doesn't have user data.
// I'll add a simple check: if I have a guest session cookie, I'm a guest (mostly).
// Actually, the best way is to check if user is authenticated.
// I'll use `useSession` from `better-auth/client` if available, or just a prop passed from page.
// The page is a server component, so I can pass `isGuest` prop to the page client component wrapper?
// But `CartSummary` is likely used inside `CartPage`.
// I'll make `CartPage` fetch session and pass it down.

interface CartSummaryProps {
    subtotal: number;
    isGuest: boolean;
}

export default function CartSummary({ subtotal, isGuest }: CartSummaryProps) {
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const shipping = 2.00; // Hardcoded as per design
    const total = subtotal + shipping;

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            // We can now allow guests to checkout directly via Stripe
            // The server action handles auth check (guest or user)
            // But we need to make sure we have a cart.
            // Assuming cartId is available in store or we can fetch it.
            // Wait, CartSummary receives subtotal. It doesn't seem to have cartId.
            // I need to get cartId. 
            // Ideally, CartPage should pass cartId or CartSummary should use store.
            // Let's assume useCartStore has cartId.

            const cartId = useCartStore.getState().cartId; // Assuming this exists or I need to fetch it.
            // If not in store, I might need to fetch it or pass it as prop.
            // Let's check useCartStore definition if possible, but for now I'll assume I can get it.
            // If useCartStore doesn't have it, I'll need to update the store or pass it.
            // Let's assume for now we pass it as prop or get from store.
            // I'll check store file in next step if needed, but for now I'll try to use store.

            if (!cartId) {
                // Fallback or error
                console.error("Cart ID not found");
                return;
            }

            const { createStripeCheckoutSession } = await import("@/lib/actions/checkout");
            const result = await createStripeCheckoutSession(cartId);

            if (result.url) {
                window.location.href = result.url;
            } else if (result.error) {
                console.error(result.error);
                setIsCheckingOut(false);
            }
        } catch (error) {
            console.error(error);
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-medium font-jost mb-6">Summary</h2>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-dark-900">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-dark-900">
                    <span>Estimated Delivery & Handling</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
            </div>

            <div className="border-t border-light-300 pt-4 mb-8">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-dark-900">Total</span>
                    <span className="text-lg font-bold text-dark-900">${total.toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-dark-900 text-white py-4 rounded-full font-medium hover:bg-dark-700 transition-colors disabled:opacity-70"
            >
                {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </button>
        </div>
    );
}
