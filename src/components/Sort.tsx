"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils/query";

const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low-High" },
    { value: "price-desc", label: "Price: High-Low" },
];

export default function Sort() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const currentSort = searchParams.get("sort") || "featured";
    const currentLabel = sortOptions.find((option) => option.value === currentSort)?.label || "Sort By";

    const handleSortChange = (value: string) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "sort",
            value,
        });

        router.push(newUrl, { scroll: false });
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-dark-900 font-medium hover:text-dark-700 transition-colors"
            >
                <span>Sort By</span>
                <span className="hidden sm:inline">: {currentLabel}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-light-200 animate-in fade-in zoom-in-95 duration-100">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSortChange(option.value)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-light-200 transition-colors ${currentSort === option.value ? "text-dark-900 font-medium bg-light-100" : "text-dark-700"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
