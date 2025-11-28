"use client";

import { useProductContext } from "@/components/ProductContext";
import { useCartStore } from "@/store/cart.store";
import { useState } from "react";
import { toast } from "sonner";

export default function AddToBagButton() {
    const { selectedVariantId } = useProductContext();
    const { addItem } = useCartStore();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToBag = async () => {
        if (!selectedVariantId) {
            toast.error("Please select a size/variant first.");
            return;
        }

        setIsAdding(true);
        try {
            await addItem(selectedVariantId, 1);
            toast.success("Added to bag!");
        } catch (error) {
            console.error("Failed to add to bag:", error);
            toast.error("Failed to add to bag. Please try again.");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <button
            onClick={handleAddToBag}
            disabled={isAdding || !selectedVariantId}
            className={`w-full py-4 rounded-md font-bold transition-all duration-300 ease-in-out
        ${!selectedVariantId
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
                    : "bg-black text-white border border-black hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98]"
                }
      `}
        >
            {isAdding ? "Adding..." : "Add to Bag"}
        </button>
    );
}
