import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { CATEGORIES } from '@/types/tool';

const EXTRACTION_PROMPT = `You are a structured data extraction assistant for a Personal Knowledge Indexer system.

Given the following raw content (could be a reel caption, a tweet thread, a blog snippet, or any text about a tool/resource), extract structured information and return ONLY a valid JSON object with these fields:

{
  "name": "The name of the tool or resource (required)",
  "category": "One of: ${CATEGORIES.join(', ')} (pick the best match)",
  "website": "The tool's website URL if mentioned, or empty string",
  "description": "A clear 1-2 sentence description of what the tool does",
  "use_case": "How someone would use this tool, practical applications",
  "tags": ["relevant", "tags", "as", "array"],
  "relevance_score": 3,
  "source_link": "The source URL if the content came from a specific link, or empty string"
}

Rules:
- Return ONLY the JSON object, no markdown, no code fences, no explanation
- "name" is required — if you cannot identify a tool name, set it to the most prominent subject
- "category" MUST be one of the listed categories
- "relevance_score" should be 1-5 based on how useful/important the tool seems
- "tags" should be 3-6 relevant keywords
- Leave fields as empty string "" if information is not available
- Do NOT fabricate URLs — only include if explicitly mentioned in the content
`;

export async function POST(request: NextRequest) {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
        return NextResponse.json(
            { error: 'Gemini API key not configured. Add GEMINI_API_KEY to .env.local' },
            { status: 500 }
        );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
        return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (content.length > 5000) {
        return NextResponse.json({ error: 'Content too long (max 5000 characters)' }, { status: 400 });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const result = await model.generateContent([
            EXTRACTION_PROMPT,
            `\n\nHere is the raw content to extract from:\n\n${content}`,
        ]);

        const response = result.response;
        const text = response.text();

        // Clean up the response — strip markdown code fences if present
        let cleaned = text.trim();
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.slice(7);
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.slice(3);
        }
        if (cleaned.endsWith('```')) {
            cleaned = cleaned.slice(0, -3);
        }
        cleaned = cleaned.trim();

        const extracted = JSON.parse(cleaned);

        // Validate and sanitize
        const validCategories = CATEGORIES as readonly string[];
        const sanitized = {
            name: String(extracted.name || '').trim(),
            category: validCategories.includes(extracted.category) ? extracted.category : 'Other',
            website: String(extracted.website || '').trim(),
            description: String(extracted.description || '').trim(),
            use_case: String(extracted.use_case || '').trim(),
            tags: Array.isArray(extracted.tags) ? extracted.tags.map((t: unknown) => String(t).trim()).filter(Boolean) : [],
            relevance_score: Math.min(5, Math.max(1, parseInt(extracted.relevance_score) || 3)),
            source_link: String(extracted.source_link || '').trim(),
        };

        return NextResponse.json(sanitized);
    } catch (err) {
        console.error('Extraction failed:', err);
        return NextResponse.json(
            { error: 'Failed to extract tool information. Please try again or fill in manually.' },
            { status: 500 }
        );
    }
}
