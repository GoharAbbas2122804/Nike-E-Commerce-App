import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CartPageContent from "@/components/CartPageContent";

export default async function CartPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const isGuest = !session?.user;

    return <CartPageContent isGuest={isGuest} />;
}
