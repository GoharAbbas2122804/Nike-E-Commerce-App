'use client'
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-dark-900 text-light-300 font-jost py-12">
            <div className="mx-auto max-w-[1440px] px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-0">

                    {/* Links Columns */}
                    <div className="flex flex-col md:flex-row gap-10 md:gap-24">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-4">
                            <Link href="/" className="mb-4">
                                <Image
                                    src="/logo.svg"
                                    alt="Nike Logo"
                                    width={60}
                                    height={21}
                                    className="invert brightness-0 h-[21px] w-auto"
                                />
                            </Link>
                            <Link href="#" className="text-white font-medium uppercase text-sm hover:text-white/80">
                                Find a Store
                            </Link>
                            <Link href="#" className="text-white font-medium uppercase text-sm hover:text-white/80">
                                Become a Member
                            </Link>
                            <Link href="#" className="text-white font-medium uppercase text-sm hover:text-white/80">
                                Sign Up for Email
                            </Link>
                            <Link href="#" className="text-white font-medium uppercase text-sm hover:text-white/80">
                                Send Us Feedback
                            </Link>
                            <Link href="#" className="text-white font-medium uppercase text-sm hover:text-white/80">
                                Student Discounts
                            </Link>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white font-medium uppercase text-sm">Get Help</h4>
                            <Link href="#" className="text-xs text-dark-500 hover:text-white">
                                Order Status
                            </Link>
                            <Link href="#" className="text-xs text-dark-500 hover:text-white">
                                Delivery
                            </Link>
                            <Link href="#" className="text-xs text-dark-500 hover:text-white">
                                Returns
                            </Link>
                            <Link href="#" className="text-xs text-dark-500 hover:text-white">
                                Payment Options
                            </Link>
                            <Link href="#" className="text-xs text-dark-500 hover:text-white">
                                Contact Us on Nike.com Inquiries
                            </Link>
                            <Link href="#" className="text-xs text-dark-500 hover:text-white">
                                Contact Us on All Other Inquiries
                            </Link>
                        </div>

                        {/* Column 3 */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white font-medium uppercase text-sm">About Nike</h4>
                            <Link href="#" className="text-xs text-dark-500 hover:text-white">
                                News
                            </Link>
                            <Link href="#" className="text-xs text-dark-500 hover:text-white">
                                Careers
                            </Link>
                            <Link href="#" className="text-xs text-dark-500 hover:text-white">
                                Investors
                            </Link>
                            <Link href="#" className="text-xs text-dark-500 hover:text-white">
                                Sustainability
                            </Link>
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-4">
                        <Link href="#" className="group">
                            <div className="bg-dark-700 rounded-full p-2 hover:bg-white transition-colors">
                                <Image src="/x.svg" alt="Twitter" width={18} height={18} className="invert group-hover:invert-0" />
                            </div>
                        </Link>
                        <Link href="#" className="group">
                            <div className="bg-dark-700 rounded-full p-2 hover:bg-white transition-colors">
                                <Image src="/facebook.svg" alt="Facebook" width={18} height={18} className="invert group-hover:invert-0" />
                            </div>
                        </Link>
                        <Link href="#" className="group">
                            <div className="bg-dark-700 rounded-full p-2 hover:bg-white transition-colors">
                                <Image src="/instagram.svg" alt="Instagram" width={18} height={18} className="invert group-hover:invert-0" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-dark-500">
                    <div className="flex items-center gap-2">
                        <Image src="/globe.svg" alt="Location" width={14} height={14} className="invert opacity-50" />
                        <span className="text-white">India</span>
                        <span className="ml-4">© 2026 Nike, Inc. All Rights Reserved</span>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <Link href="#" className="hover:text-white">Guides</Link>
                        <Link href="#" className="hover:text-white">Terms of Sale</Link>
                        <Link href="#" className="hover:text-white">Terms of Use</Link>
                        <Link href="#" className="hover:text-white">Nike Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
