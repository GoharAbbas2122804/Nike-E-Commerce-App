'use client'
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart.store";
import { useEffect } from "react";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { items, fetchCart } = useCartStore();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-50 w-full bg-white font-jost border-b border-light-300"
        >
            <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 md:px-12">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Image
                            src="/logo.svg"
                            alt="Nike Logo"
                            width={90}
                            height={32}
                            className="h-[32px] w-auto invert"
                            priority
                        />
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/products?sort=newest" className="text-dark-900 font-medium hover:opacity-70 relative group">
                        New & Featured
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dark-900 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/products?gender=men" className="text-dark-900 font-medium hover:opacity-70 relative group">
                        Men
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dark-900 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/products?gender=women" className="text-dark-900 font-medium hover:opacity-70 relative group">
                        Women
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dark-900 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/products?kids=boys,girls" className="text-dark-900 font-medium hover:opacity-70 relative group">
                        Kids
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dark-900 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/products" className="text-dark-900 font-medium hover:opacity-70 relative group">
                        Sale
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dark-900 transition-all group-hover:w-full"></span>
                    </Link>
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-4">
                    {/* Search Icon */}
                    <div className="hidden md:flex items-center rounded-full bg-light-200 px-3 py-2 hover:bg-light-300 transition-colors cursor-pointer group">
                        <svg
                            aria-hidden="true"
                            className="h-6 w-6 text-dark-900 group-hover:scale-110 transition-transform"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent border-none outline-none text-sm ml-2 w-24 placeholder:text-dark-500 font-medium"
                        />
                    </div>

                    {/* Heart Icon */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="hidden md:block p-2 hover:bg-light-200 rounded-full transition-colors"
                    >
                        <svg
                            aria-hidden="true"
                            className="h-6 w-6 text-dark-900"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </motion.button>

                    {/* Bag Icon */}
                    <Link href="/cart">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-light-200 rounded-full transition-colors relative"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 text-dark-900"
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-black text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </motion.button>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-dark-900"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden flex flex-col p-6 gap-4 z-40 overflow-hidden"
                >
                    <Link href="/products?sort=newest" className="text-xl font-medium text-dark-900">
                        New & Featured
                    </Link>
                    <Link href="/products?gender=men" className="text-xl font-medium text-dark-900">
                        Men
                    </Link>
                    <Link href="/products?gender=women" className="text-xl font-medium text-dark-900">
                        Women
                    </Link>
                    <Link href="/products?kids=boys,girls" className="text-xl font-medium text-dark-900">
                        Kids
                    </Link>
                    <Link href="/products" className="text-xl font-medium text-dark-900">
                        Sale
                    </Link>
                    <div className="mt-4 pt-4 border-t border-light-300">
                        <p className="text-dark-700 mb-4">Become a Member</p>
                        <p className="text-dark-700 mb-4">Sign In</p>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
