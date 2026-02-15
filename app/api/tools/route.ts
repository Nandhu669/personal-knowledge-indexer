import { createClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/tools — List tools with search, filter, sort, pagination
export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const tags = searchParams.get('tags') || '';
    const sort = searchParams.get('sort') || 'recent';
    const favoritesOnly = searchParams.get('favorites') === 'true';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const offset = (page - 1) * limit;

    let query = supabase.from('tools').select('*', { count: 'exact' });

    // Full-text search
    if (search) {
        query = query.or(
            `name.ilike.%${search}%,description.ilike.%${search}%`
        );
    }

    // Category filter
    if (category) {
        query = query.eq('category', category);
    }

    // Tag filter
    if (tags) {
        const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
        if (tagArray.length > 0) {
            query = query.overlaps('tags', tagArray);
        }
    }

    // Favorites filter
    if (favoritesOnly) {
        query = query.eq('is_favorite', true);
    }

    // Sorting
    switch (sort) {
        case 'relevance':
            query = query.order('relevance_score', { ascending: false });
            break;
        case 'most_used':
            query = query.order('usage_count', { ascending: false });
            break;
        case 'name':
            query = query.order('name', { ascending: true });
            break;
        case 'recent':
        default:
            query = query.order('created_at', { ascending: false });
            break;
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        tools: data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
    });
}

// POST /api/tools — Create new tool entry
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body.name || body.name.trim() === '') {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (body.relevance_score && (body.relevance_score < 1 || body.relevance_score > 5)) {
        return NextResponse.json({ error: 'Relevance score must be 1–5' }, { status: 400 });
    }

    const toolData = {
        user_id: user.id,
        name: body.name.trim(),
        category: body.category || 'Other',
        website: body.website || null,
        description: body.description || null,
        use_case: body.use_case || null,
        relevance_score: body.relevance_score || 3,
        tags: body.tags || [],
        source_link: body.source_link || null,
        is_favorite: false,
        usage_count: 0,
    };

    const { data, error } = await supabase
        .from('tools')
        .insert(toolData)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
