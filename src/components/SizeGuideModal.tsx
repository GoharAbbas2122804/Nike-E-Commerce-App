"use client";

import { X, Ruler } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const sizeData = [
    { usMen: "3.5", usWomen: "5", uk: "3", eu: "35.5", inch: "8 1/2" },
    { usMen: "4", usWomen: "5.5", uk: "3.5", eu: "36", inch: "8 11/16" },
    { usMen: "4.5", usWomen: "6", uk: "4", eu: "36.5", inch: "8 13/16" },
    { usMen: "5", usWomen: "6.5", uk: "4.5", eu: "37.5", inch: "9" },
    { usMen: "5.5", usWomen: "7", uk: "5", eu: "38", inch: "9 3/16" },
    { usMen: "6", usWomen: "7.5", uk: "5.5", eu: "38.5", inch: "9 5/16" },
    { usMen: "6.5", usWomen: "8", uk: "6", eu: "39", inch: "9 1/2" },
    { usMen: "7", usWomen: "8.5", uk: "6", eu: "40", inch: "9 11/16" },
    { usMen: "7.5", usWomen: "9", uk: "6.5", eu: "40.5", inch: "9 13/16" },
    { usMen: "8", usWomen: "9.5", uk: "7", eu: "41", inch: "10" },
    { usMen: "8.5", usWomen: "10", uk: "7.5", eu: "42", inch: "10 3/16" },
    { usMen: "9", usWomen: "10.5", uk: "8", eu: "42.5", inch: "10 5/16" },
    { usMen: "9.5", usWomen: "11", uk: "8.5", eu: "43", inch: "10 1/2" },
    { usMen: "10", usWomen: "11.5", uk: "9", eu: "44", inch: "10 11/16" },
    { usMen: "10.5", usWomen: "12", uk: "9.5", eu: "44.5", inch: "10 13/16" },
    { usMen: "11", usWomen: "12.5", uk: "10", eu: "45", inch: "11" },
    { usMen: "11.5", usWomen: "13", uk: "10.5", eu: "45.5", inch: "11 3/16" },
    { usMen: "12", usWomen: "13.5", uk: "11", eu: "46", inch: "11 5/16" },
    { usMen: "12.5", usWomen: "14", uk: "11.5", eu: "47", inch: "11 1/2" },
    { usMen: "13", usWomen: "14.5", uk: "12", eu: "47.5", inch: "11 11/16" },
    { usMen: "13.5", usWomen: "15", uk: "12.5", eu: "48", inch: "11 13/16" },
    { usMen: "14", usWomen: "15.5", uk: "13", eu: "48.5", inch: "12" },
    { usMen: "14.5", usWomen: "16", uk: "13.5", eu: "49", inch: "12 3/16" },
    { usMen: "15", usWomen: "16.5", uk: "14", eu: "49.5", inch: "12 5/16" },
    { usMen: "15.5", usWomen: "17", uk: "14.5", eu: "50", inch: "12 1/2" },
    { usMen: "16", usWomen: "17.5", uk: "15", eu: "50.5", inch: "12 11/16" },
    { usMen: "16.5", usWomen: "18", uk: "15.5", eu: "51", inch: "12 13/16" },
    { usMen: "17", usWomen: "18.5", uk: "16", eu: "51.5", inch: "13" },
    { usMen: "17.5", usWomen: "19", uk: "16.5", eu: "52", inch: "13 3/16" },
    { usMen: "18", usWomen: "19.5", uk: "17", eu: "52.5", inch: "13 5/16" },
    { usMen: "18.5", usWomen: "20", uk: "17.5", eu: "53", inch: "13 1/2" },
    { usMen: "19", usWomen: "20.5", uk: "18", eu: "53.5", inch: "13 11/16" },
    { usMen: "19.5", usWomen: "21", uk: "18.5", eu: "54", inch: "13 13/16" },
    { usMen: "20", usWomen: "21.5", uk: "19", eu: "54.5", inch: "14" },
    { usMen: "20.5", usWomen: "22", uk: "19.5", eu: "55", inch: "14 3/16" },
    { usMen: "21", usWomen: "22.5", uk: "20", eu: "55.5", inch: "14 5/16" },
    { usMen: "21.5", usWomen: "23", uk: "20.5", eu: "56", inch: "14 1/2" },
    { usMen: "22", usWomen: "23.5", uk: "21", eu: "56.5", inch: "14 11/16" },
];

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Ruler className="w-6 h-6" />
                        Size Guide
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close size guide"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 space-y-8">
                    {/* Measurement Instructions */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">How to Measure</h3>
                        <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
                            <div className="space-y-3 text-sm text-gray-700">
                                <p>1. Tape a piece of paper to a hard, flat surface.</p>
                                <p>2. Stand on the paper with feet shoulder-width apart and weight evenly distributed.</p>
                                <p>3. Have someone mark the tip of your longest toe and the back of your heel.</p>
                            </div>
                            <div className="space-y-3 text-sm text-gray-700">
                                <p>4. Measure the distance between the marks with a ruler or measuring tape.</p>
                                <p>5. Repeat for the other foot and use the longer measurement.</p>
                                <p>6. If between sizes, recommend sizing up for comfort.</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 italic">
                            Note: It's common for one foot to be slightly longer—use the longer measurement. CM on shoe boxes differs from foot length in CM.
                        </p>
                    </div>

                    {/* Size Chart */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Size Chart</h3>
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="w-full text-sm text-center">
                                <thead className="bg-gray-100 text-gray-900 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3 border-b">US - Men's</th>
                                        <th className="px-4 py-3 border-b">US - Women's</th>
                                        <th className="px-4 py-3 border-b">UK</th>
                                        <th className="px-4 py-3 border-b">EU</th>
                                        <th className="px-4 py-3 border-b">Foot Length (in)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {sizeData.map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2 font-medium">{row.usMen}</td>
                                            <td className="px-4 py-2 text-gray-600">{row.usWomen}</td>
                                            <td className="px-4 py-2 text-gray-600">{row.uk}</td>
                                            <td className="px-4 py-2 text-gray-600">{row.eu}</td>
                                            <td className="px-4 py-2 text-gray-600">{row.inch}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
