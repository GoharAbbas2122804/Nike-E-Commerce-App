"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils/query";

const filters = [
    {
        id: "category",
        name: "Category",
        options: [
            { value: "lifestyle", label: "Lifestyle" },
            { value: "running", label: "Running" },
            { value: "training", label: "Training & Gym" },
            { value: "basketball", label: "Basketball" },
            { value: "football", label: "Football" },
        ],
    },
    {
        id: "gender",
        name: "Gender",
        options: [
            { value: "men", label: "Men" },
            { value: "women", label: "Women" },
            { value: "unisex", label: "Unisex" },
        ],
    },
    {
        id: "kids",
        name: "Kids",
        options: [
            { value: "boys", label: "Boys" },
            { value: "girls", label: "Girls" },
        ],
    },
    {
        id: "color",
        name: "Colour",
        options: [
            { value: "black", label: "Black" },
            { value: "white", label: "White" },
            { value: "blue", label: "Blue" },
            { value: "red", label: "Red" },
            { value: "green", label: "Green" },
            { value: "grey", label: "Grey" },
            { value: "pink", label: "Pink" },
            { value: "multi-color", label: "Multi-Colour" },
        ],
    },
    {
        id: "size",
        name: "Size",
        options: [
            { value: "uk-6", label: "UK 6" },
            { value: "uk-6.5", label: "UK 6.5" },
            { value: "uk-7", label: "UK 7" },
            { value: "uk-7.5", label: "UK 7.5" },
            { value: "uk-8", label: "UK 8" },
            { value: "uk-8.5", label: "UK 8.5" },
            { value: "uk-9", label: "UK 9" },
            { value: "uk-10", label: "UK 10" },
            { value: "uk-11", label: "UK 11" },
        ],
    },
    {
        id: "price",
        name: "Shop By Price",
        options: [
            { value: "0-50", label: "Under $50.00" },
            { value: "51-100", label: "$51.00 - $100.00" },
            { value: "101-150", label: "$101.00 - $150.00" },
            { value: "151-1000", label: "Over $150.00" },
        ],
    },
];

export default function Filters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleFilterChange = (key: string, value: string) => {
        let newUrl = "";

        const currentValues = searchParams.get(key)?.split(",") || [];
        const isSelected = currentValues.includes(value);

        let updatedValues: string[];

        if (isSelected) {
            updatedValues = currentValues.filter((item) => item !== value);
        } else {
            updatedValues = [...currentValues, value];
        }

        if (updatedValues.length > 0) {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key,
                value: updatedValues.join(","),
            });
        } else {
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: [key],
            });
        }

        router.push(newUrl, { scroll: false });
    };

    return (
        <>
            {/* Mobile Filter Button - Positioned absolutely in the header area via page layout, 
          but here we provide the trigger. Actually, the user asked for top-left. 
          We'll render it here but it might need to be placed in the page layout to be "top-left" 
          relative to the grid. 
          However, to keep it self-contained, let's render it here and use portal or just CSS positioning.
          Better yet, let's expose the open state or button.
          For now, let's keep the button here but style it to be visible on mobile.
      */}
            <div className="lg:hidden mb-4">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="text-dark-900 font-medium flex items-center gap-2"
                >
                    Filter
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                        />
                    </svg>
                </button>
            </div>

            {/* Sidebar (Desktop) */}
            <div className="hidden lg:block w-64 pr-8 sticky top-24 h-fit overflow-y-auto">
                <div className="flex flex-col gap-8 pb-10">
                    {filters.map((section) => (
                        <div key={section.id} className="border-t border-light-300 pt-4 first:border-t-0 first:pt-0">
                            <h3 className="font-medium text-dark-900 mb-4">{section.name}</h3>
                            <div className="flex flex-col gap-2">
                                {section.options.map((option) => {
                                    const isChecked =
                                        searchParams.get(section.id)?.split(",").includes(option.value) || false;
                                    return (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-2 cursor-pointer group"
                                        >
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer h-5 w-5 appearance-none rounded border border-light-400 checked:bg-dark-900 checked:border-dark-900 focus:ring-1 focus:ring-dark-900 focus:ring-offset-1 transition-all"
                                                    checked={isChecked}
                                                    onChange={() => handleFilterChange(section.id, option.value)}
                                                />
                                                <svg
                                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                            <span className="text-dark-900 group-hover:text-dark-700 transition-colors">
                                                {option.label}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50 transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="absolute right-0 top-0 h-full w-[300px] bg-white p-6 shadow-xl overflow-y-auto animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-medium text-dark-900">Filters</h2>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 hover:bg-light-200 rounded-full transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-8">
                            {filters.map((section) => (
                                <div key={section.id} className="border-t border-light-300 pt-4 first:border-t-0 first:pt-0">
                                    <h3 className="font-medium text-dark-900 mb-4">{section.name}</h3>
                                    <div className="flex flex-col gap-3">
                                        {section.options.map((option) => {
                                            const isChecked =
                                                searchParams.get(section.id)?.split(",").includes(option.value) || false;
                                            return (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center gap-3 cursor-pointer"
                                                >
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="peer h-5 w-5 appearance-none rounded border border-light-400 checked:bg-dark-900 checked:border-dark-900 focus:ring-1 focus:ring-dark-900 focus:ring-offset-1 transition-all"
                                                            checked={isChecked}
                                                            onChange={() => handleFilterChange(section.id, option.value)}
                                                        />
                                                        <svg
                                                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    </div>
                                                    <span className="text-dark-900">{option.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
