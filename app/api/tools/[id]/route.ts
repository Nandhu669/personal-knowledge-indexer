import { createClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/tools/[id] — Get single tool
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    return NextResponse.json(data);
}

// PUT /api/tools/[id] — Update tool
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validation
    if (body.name !== undefined && body.name.trim() === '') {
        return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
    }

    if (body.relevance_score !== undefined && (body.relevance_score < 1 || body.relevance_score > 5)) {
        return NextResponse.json({ error: 'Relevance score must be 1–5' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
        'name', 'category', 'website', 'description',
        'use_case', 'relevance_score', 'tags', 'source_link',
    ];

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            updateData[field] = body[field];
        }
    }

    const { data, error } = await supabase
        .from('tools')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// DELETE /api/tools/[id] — Delete tool
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Tool deleted' });
}
