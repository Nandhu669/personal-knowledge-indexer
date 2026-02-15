import { createClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/tools/[id]/usage — Increment usage count
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get current usage_count
    const { data: tool, error: fetchError } = await supabase
        .from('tools')
        .select('usage_count')
        .eq('id', id)
        .single();

    if (fetchError || !tool) {
        return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    const { data, error } = await supabase
        .from('tools')
        .update({ usage_count: (tool.usage_count || 0) + 1 })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
