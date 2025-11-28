'use client';

import Link from 'next/link';
import { useState, useActionState, useEffect } from 'react';
import { signIn, signUp } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
    type: 'sign-in' | 'sign-up';
}

interface ActionState {
    error?: {
        name?: string[];
        email?: string[];
        password?: string[];
        root?: string[];
    };
    success?: boolean;
}

const initialState: ActionState = {
    error: {},
    success: false,
};

export default function AuthForm({ type }: AuthFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [state, action, isPending] = useActionState<ActionState, FormData>(
        type === 'sign-in' ? signIn as any : signUp as any,
        initialState
    );

    useEffect(() => {
        if (state?.success) {
            router.push('/');
        }
    }, [state?.success, router]);

    return (
        <form action={action} className="w-full flex flex-col gap-5">
            {type === 'sign-up' && (
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-dark-900">Full Name</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full p-3 border border-light-300 rounded-md focus:outline-none focus:border-dark-900 transition-colors text-dark-900 placeholder:text-dark-700/50"
                    />
                    {state?.error?.name && (
                        <p className="text-red-500 text-xs">{state.error.name}</p>
                    )}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-dark-900">Email</label>
                <input
                    name="email"
                    type="email"
                    placeholder="johndoe@gmail.com"
                    className="w-full p-3 border border-light-300 rounded-md focus:outline-none focus:border-dark-900 transition-colors text-dark-900 placeholder:text-dark-700/50"
                />
                {state?.error?.email && (
                    <p className="text-red-500 text-xs">{state.error.email}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-dark-900">Password</label>
                <div className="relative">
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="minimum 8 characters"
                        className="w-full p-3 border border-light-300 rounded-md focus:outline-none focus:border-dark-900 transition-colors text-dark-900 placeholder:text-dark-700/50"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-700 hover:text-dark-900"
                    >
                        {showPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        )}
                    </button>
                </div>
                {state?.error?.password && (
                    <p className="text-red-500 text-xs">{state.error.password}</p>
                )}
            </div>

            {state?.error?.root && (
                <p className="text-red-500 text-sm text-center">{state.error.root}</p>
            )}

            <button
                disabled={isPending}
                className="w-full bg-dark-900 text-white font-medium py-3 rounded-full hover:bg-dark-900/90 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Loading...' : (type === 'sign-in' ? 'Sign In' : 'Sign Up')}
            </button>

            <p className="text-xs text-center text-dark-700 mt-4">
                By signing up, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>
            </p>
        </form>
    );
}
