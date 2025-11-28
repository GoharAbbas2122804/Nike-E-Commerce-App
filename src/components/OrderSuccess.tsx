"use client";

import { CheckCircle, Package, MapPin } from "lucide-react";
import Link from "next/link";

interface OrderSuccessProps {
    order: any; // Using any for simplicity, but ideally typed
}

export default function OrderSuccess({ order }: OrderSuccessProps) {
    if (!order) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-dark-900 mb-2">Order Confirmed!</h1>
                <p className="text-dark-500">
                    Thank you for your purchase. Your order ID is <span className="font-mono font-medium text-dark-900">{order.id.slice(0, 8)}</span>
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-light-300 overflow-hidden mb-8">
                <div className="p-6 border-b border-light-300">
                    <h2 className="text-lg font-medium text-dark-900 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Order Details
                    </h2>
                </div>
                <div className="p-6">
                    <div className="space-y-6">
                        {order.items.map((item: any) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-20 h-20 bg-light-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.variant.product.images[0]?.url || "/placeholder.png"}
                                        alt={item.variant.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-dark-900">{item.variant.product.name}</h3>
                                    <p className="text-sm text-dark-500">
                                        Size: {item.variant.size.name} | Color: {item.variant.color.name}
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm text-dark-500">Qty: {item.quantity}</span>
                                        <span className="font-medium text-dark-900">${Number(item.priceAtPurchase).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-light-50 p-6 border-t border-light-300">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-dark-500">Subtotal</span>
                        <span className="font-medium text-dark-900">${(Number(order.totalAmount) - 2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-dark-500">Shipping</span>
                        <span className="font-medium text-dark-900">$2.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-light-300">
                        <span className="text-lg font-bold text-dark-900">Total</span>
                        <span className="text-lg font-bold text-dark-900">${Number(order.totalAmount).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {order.shippingAddress && (
                <div className="bg-white rounded-2xl border border-light-300 overflow-hidden mb-8">
                    <div className="p-6 border-b border-light-300">
                        <h2 className="text-lg font-medium text-dark-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Shipping Address
                        </h2>
                    </div>
                    <div className="p-6">
                        <p className="text-dark-900">{order.shippingAddress.line1}</p>
                        {order.shippingAddress.line2 && <p className="text-dark-900">{order.shippingAddress.line2}</p>}
                        <p className="text-dark-900">
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                        </p>
                        <p className="text-dark-900">{order.shippingAddress.country}</p>
                    </div>
                </div>
            )}

            <div className="text-center">
                <Link
                    href="/"
                    className="inline-block bg-dark-900 text-white px-8 py-3 rounded-full font-medium hover:bg-dark-700 transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
