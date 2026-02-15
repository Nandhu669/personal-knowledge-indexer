import { createClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/tools/[id]/favorite — Toggle favorite
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

    // Get current favorite status
    const { data: tool, error: fetchError } = await supabase
        .from('tools')
        .select('is_favorite')
        .eq('id', id)
        .single();

    if (fetchError || !tool) {
        return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    // Toggle
    const { data, error } = await supabase
        .from('tools')
        .update({ is_favorite: !tool.is_favorite })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
