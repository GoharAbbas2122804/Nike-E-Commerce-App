import AuthForm from "@/components/AuthForm";
import SocialProviders from "@/components/SocialProviders";
import Link from "next/link";

export default function SignUpPage() {
    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full mb-8 text-center">
                <p className="text-dark-700 mb-2 text-sm">
                    Already have an account? <Link href="/sign-in" className="font-medium text-dark-900 underline">Sign In</Link>
                </p>
                <h2 className="text-3xl font-bold text-dark-900 mb-2">Join Nike Today!</h2>
                <p className="text-dark-700 text-sm">
                    Create your account to start your fitness journey
                </p>
            </div>

            <SocialProviders />

            <div className="relative w-full my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-light-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-dark-700">Or sign up with</span>
                </div>
            </div>

            <AuthForm type="sign-up" />
        </div>
    );
}
