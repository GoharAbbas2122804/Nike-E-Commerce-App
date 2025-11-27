import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex min-h-screen flex-col">
            <Navbar />
            {children}
            <Footer />
        </main>
    );
}
