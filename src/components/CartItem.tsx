"use client";

import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCartStore, CartItem as CartItemType } from "@/store/cart.store";
import { motion } from "framer-motion";

interface CartItemProps {
    item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
    const { updateItem, removeItem } = useCartStore();

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) return;
        if (newQuantity > item.maxStock) return; // Optional: show toast
        updateItem(item.id, newQuantity);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col sm:flex-row gap-6 py-6 border-b border-light-300"
        >
            {/* Image */}
            <div className="relative w-full sm:w-40 aspect-square bg-light-200 rounded-sm overflow-hidden flex-shrink-0">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-center"
                />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        {/* Estimated Arrival */}
                        <p className="text-orange text-sm font-medium mb-1">
                            Estimated arrival {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <h3 className="text-xl font-medium text-dark-900 mb-1">
                            {item.name}
                        </h3>
                        <p className="text-dark-700 text-sm mb-4">
                            {item.gender} {item.category}
                        </p>

                        <div className="flex items-center gap-6 text-dark-700 text-sm">
                            <p>Size <span className="text-dark-900 font-medium ml-1">{item.size}</span></p>

                            <div className="flex items-center gap-3">
                                <span>Quantity</span>
                                <div className="flex items-center bg-light-200 rounded-full px-2 py-1">
                                    <button
                                        onClick={() => handleQuantityChange(item.quantity - 1)}
                                        className="p-1 hover:text-dark-900 transition-colors"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-6 text-center font-medium text-dark-900">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item.quantity + 1)}
                                        className="p-1 hover:text-dark-900 transition-colors"
                                        disabled={item.quantity >= item.maxStock}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-lg font-medium text-dark-900">
                            ${(item.salePrice || item.price).toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end mt-4 sm:mt-0">
                    <button
                        onClick={() => removeItem(item.id)}
                        className="text-red hover:text-red/80 transition-colors p-2"
                        aria-label="Remove item"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
