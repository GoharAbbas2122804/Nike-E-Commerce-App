"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export default function CollapsibleSection({
    title,
    children,
    defaultOpen = false,
}: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full text-left group"
                aria-expanded={isOpen}
            >
                <span className="text-lg font-medium">{title}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 transition-transform" />
                ) : (
                    <ChevronDown className="w-5 h-5 transition-transform" />
                )}
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
                )}
            >
                <div className="pb-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
}
