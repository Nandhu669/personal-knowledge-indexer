'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Database } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
            if (loginError) {
                setError(loginError.message);
                return;
            }
            router.push('/dashboard');
            router.refresh();
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-[18px] border border-[var(--border-default)] bg-white p-8 shadow-[var(--shadow-soft)]">
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-[14px] bg-[var(--brand-100)]">
                        <Database className="h-7 w-7 text-[var(--brand-500)]" />
                    </div>
                    <h1 className="text-3xl font-semibold tracking-[-0.3px] text-[#081a34]">Welcome Back</h1>
                    <p className="mt-1 text-sm text-[#5f7594]">Sign in to your Knowledge Indexer</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="rounded-[var(--radius-md)] border border-[#f0c8c8] bg-[#fff4f4] px-3 py-2 text-sm text-[#b13a3a]">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#1e3551]">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            placeholder="you@example.com"
                            className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] px-3.5 text-sm text-[#081a34] placeholder:text-[#8fa0b8] focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)]"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#1e3551]">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            placeholder="********"
                            className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] px-3.5 text-sm text-[#081a34] placeholder:text-[#8fa0b8] focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-500)] text-sm font-semibold text-white hover:bg-[var(--brand-600)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#5f7594]">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)]">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
