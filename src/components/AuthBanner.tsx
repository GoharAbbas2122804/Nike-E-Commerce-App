'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const slides = [
    {
        id: 0,
        title: "Just Do It",
        description: "Join millions of athletes and fitness enthusiasts who trust Nike for their performance needs.",
        color: "bg-dark-900"
    },
    {
        id: 1,
        title: "Run Your Way",
        description: "Whether you're a marathon runner or just starting out, find the perfect gear to support your journey.",
        color: "bg-blue-900"
    },
    {
        id: 2,
        title: "Style Meets Comfort",
        description: "Discover the latest trends in sportswear that combine iconic Nike style with unmatched comfort.",
        color: "bg-orange-800"
    }
];

export default function AuthBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={`hidden lg:flex w-1/2 text-white flex-col justify-between p-12 relative overflow-hidden transition-colors duration-700 ${slides[currentSlide].color}`}>
            <div className="z-10">
                <Link href="/" className="inline-block">
                    <div className="bg-white p-2 rounded-xl w-12 h-12 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="black" strokeWidth="2" />
                            <path d="M7 13L10 16L17 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </Link>
            </div>

            <div className="z-10 max-w-lg min-h-[200px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl font-bold mb-6">{slides[currentSlide].title}</h1>
                        <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                            {slides[currentSlide].description}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <div className="flex gap-3">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.id}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            <div className="z-10 text-sm text-white/60">
                © 2026 Nike. All rights reserved.
            </div>

            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute right-[-10%] top-[20%] w-[500px] h-[500px] rounded-full bg-white blur-3xl"
                />
            </div>
        </div>
    );
}
