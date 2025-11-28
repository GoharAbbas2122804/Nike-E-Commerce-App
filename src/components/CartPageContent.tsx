"use client";

import { useCartStore } from "@/store/cart.store";
import { useEffect } from "react";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";
import Link from "next/link";

interface CartPageContentProps {
    isGuest: boolean;
}

export default function CartPageContent({ isGuest }: CartPageContentProps) {
    const { items, subtotal, isLoading, fetchCart } = useCartStore();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Initial loading state
    if (isLoading && items.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 font-jost">
            <h1 className="text-3xl font-medium mb-8">Cart</h1>

            {items.length === 0 ? (
                <div className="text-center py-20 bg-light-200 rounded-lg">
                    <p className="text-xl text-dark-700 mb-6">Your cart is empty</p>
                    <Link
                        href="/products"
                        className="inline-block bg-dark-900 text-white px-8 py-3 rounded-full font-medium hover:bg-dark-700 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Items List */}
                    <div className="flex-1">
                        {items.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="w-full lg:w-[400px] flex-shrink-0">
                        <CartSummary subtotal={subtotal} isGuest={isGuest} />
                    </div>
                </div>
            )}
        </div>
    );
}
