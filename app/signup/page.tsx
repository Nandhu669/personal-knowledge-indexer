'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Database } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';

export default function SignupPage() {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            const { error: signupError } = await supabase.auth.signUp({ email, password });
            if (signupError) {
                setError(signupError.message);
                return;
            }
            setSuccess('Account created! Check your email for a confirmation link, then sign in.');
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
                    <h1 className="text-3xl font-semibold tracking-[-0.3px] text-[#081a34]">Create Account</h1>
                    <p className="mt-1 text-sm text-[#5f7594]">Start indexing your knowledge</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    {error && (
                        <div className="rounded-[var(--radius-md)] border border-[#f0c8c8] bg-[#fff4f4] px-3 py-2 text-sm text-[#b13a3a]">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="rounded-[var(--radius-md)] border border-[#c8eccc] bg-[#f1fff4] px-3 py-2 text-sm text-[#206f35]">
                            {success}
                            <Link href="/login" className="mt-1 block font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)]">
                                Go to Sign In
                            </Link>
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
                            placeholder="Min. 6 characters"
                            className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] px-3.5 text-sm text-[#081a34] placeholder:text-[#8fa0b8] focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)]"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-[#1e3551]">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                            placeholder="********"
                            className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] px-3.5 text-sm text-[#081a34] placeholder:text-[#8fa0b8] focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !!success}
                        className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-500)] text-sm font-semibold text-white hover:bg-[var(--brand-600)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#5f7594]">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)]">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
