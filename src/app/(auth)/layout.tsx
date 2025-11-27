import Image from "next/image";
import Link from "next/link";
import AuthBanner from "@/components/AuthBanner";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen w-full font-jost">
            <AuthBanner />

            {/* Right Side - Form Content */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 overflow-y-auto">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
