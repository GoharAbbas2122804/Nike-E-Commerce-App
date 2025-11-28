"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <div className="relative w-full min-h-[600px] md:h-[800px] mb-12 bg-light-100 overflow-hidden flex justify-center">
            <div className="w-full max-w-[1440px] px-6 md:px-12 flex flex-col-reverse md:flex-row items-center justify-between py-12 md:py-0 relative z-10">

                {/* Text Content (Left on Desktop, Bottom on Mobile) */}
                <div className="w-full md:w-1/2 flex flex-col items-start justify-center mt-8 md:mt-0">
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-dark-900 font-semibold mb-4 tracking-widest uppercase text-sm md:text-base"
                    >
                        First Look
                    </motion.p>
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-dark-900 uppercase mb-6 tracking-tighter leading-none text-left"
                    >
                        Nike Air Max<br />Pulse
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        className="text-dark-900 max-w-xl mb-10 text-lg md:text-xl font-medium leading-relaxed text-left"
                    >
                        Extreme comfort. Hyper durable. Max volume. Introducing the Air Max Pulse
                        —designed to push you past your limits and help you go to the max.
                    </motion.p>
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                        className="flex gap-4"
                    >
                        <button className="bg-dark-900 text-white px-8 py-3 rounded-full font-bold hover:bg-dark-900/80 transition-all hover:scale-105 active:scale-95 shadow-lg">
                            Buy Now
                        </button>
                        <button className="bg-white text-dark-900 border-2 border-dark-900 px-8 py-3 rounded-full font-bold hover:bg-light-100 transition-all hover:scale-105 active:scale-95 shadow-lg">
                            Add to Cart
                        </button>
                    </motion.div>
                </div>

                {/* Image Content (Right on Desktop, Top on Mobile) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2 }}
                    className="w-full md:w-1/2 h-[300px] md:h-[600px] relative flex items-center justify-center"
                >
                    <Image
                        src="/hero-shoe.png"
                        alt="Nike Air Max"
                        fill
                        className="object-contain object-center scale-110 md:scale-125 hover:scale-135 transition-transform duration-700"
                        priority
                    />
                </motion.div>
            </div>

            {/* Background Gradient Overlay (Optional) */}
            <div className="absolute inset-0 bg-gradient-to-r from-light-100 via-transparent to-transparent pointer-events-none" />
        </div>
    );
}
