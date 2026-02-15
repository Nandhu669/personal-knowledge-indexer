import { createClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth — Sign up or Sign in
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const body = await request.json();
    const { email, password, action } = body;

    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (action === 'signup') {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            message: 'Sign up successful. Please check your email for confirmation.',
            user: data.user,
        });
    }

    // Default: sign in
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({
        message: 'Signed in successfully',
        user: data.user,
    });
}
