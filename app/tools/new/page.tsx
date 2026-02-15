'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { ArrowLeft, CheckCircle, Sparkles, Plus, Layout } from 'lucide-react';
import ToolForm from '@/components/ToolForm';
import { ToolFormData } from '@/types/tool';
import { SidebarInset } from "@/components/ui/sidebar";
import Header from '@/components/Header';
import { useDashboard } from '@/contexts/DashboardContext';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

export default function NewToolPage() {
    const router = useRouter();
    const { currentView } = useDashboard();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [rawContent, setRawContent] = React.useState('');
    const [isExtracting, setIsExtracting] = React.useState(false);
    const [extractError, setExtractError] = React.useState('');
    const [extractedData, setExtractedData] = React.useState<Partial<ToolFormData> | null>(null);
    const [showExtractor, setShowExtractor] = React.useState(true);

    const handleExtract = async () => {
        if (!rawContent.trim()) return;
        setIsExtracting(true);
        setExtractError('');

        try {
            const res = await fetch('/api/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: rawContent }),
            });
            if (res.ok) {
                const data = await res.json();
                setExtractedData(data);
                setShowExtractor(false);
            } else {
                const payload = await res.json();
                setExtractError(payload.error || 'Extraction failed');
            }
        } catch {
            setExtractError('Network error. Please try again.');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleCreate = async (data: ToolFormData) => {
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/tools', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                const tool = await res.json();
                router.push(`/tools/${tool.id}`);
            } else {
                const payload = await res.json();
                setError(payload.error || 'Failed to create tool');
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
            <Header currentView={currentView} />

            <div className="flex-1 overflow-y-auto px-6 py-8">
                <div className="mx-auto max-w-2xl">
                    <Link
                        href="/dashboard"
                        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Dashboard
                    </Link>

                    {showExtractor && (
                        <Card className="mb-8 border-primary/20 bg-primary/5 backdrop-blur-sm shadow-2xl shadow-primary/5">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                        <Sparkles className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">AI Assistant Extraction</CardTitle>
                                        <CardDescription>
                                            Paste raw content about a tool and let Gemini structure it for you.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {extractError && (
                                    <Alert variant="destructive" className="mb-4 rounded-xl">
                                        <AlertTitle>Extraction Error</AlertTitle>
                                        <AlertDescription>{extractError}</AlertDescription>
                                    </Alert>
                                )}
                                <Textarea
                                    value={rawContent}
                                    onChange={(event) => setRawContent(event.target.value)}
                                    rows={5}
                                    maxLength={5000}
                                    placeholder="Paste website description, reviews, or raw notes here..."
                                    className="resize-none rounded-xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all"
                                />
                                <div className="mt-3 flex items-center justify-end text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                                    {rawContent.length} / 5000 characters
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowExtractor(false)}
                                    className="rounded-xl font-bold text-muted-foreground hover:text-foreground"
                                >
                                    Skip, fill manually
                                </Button>
                                <Button
                                    onClick={handleExtract}
                                    disabled={isExtracting || !rawContent.trim()}
                                    className="rounded-xl bg-primary px-6 font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all"
                                >
                                    {isExtracting ? (
                                        "Extracting..."
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Extract with AI
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {!showExtractor && extractedData && (
                        <Alert className="mb-8 border-accent/30 bg-accent/5 backdrop-blur-sm rounded-2xl border-dashed">
                            <CheckCircle className="h-4 w-4 text-accent" />
                            <AlertTitle className="text-accent font-bold">Extraction Successful</AlertTitle>
                            <AlertDescription className="flex items-center justify-between mt-1">
                                <span className="text-muted-foreground">AI has pre-filled the form. Please review before saving.</span>
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-xs text-accent font-bold"
                                    onClick={() => {
                                        setShowExtractor(true);
                                        setExtractedData(null);
                                    }}
                                >
                                    Restart AI
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}

                    <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl">
                        <CardHeader className="border-b border-border/50 bg-muted/20 px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-muted border border-border/50">
                                    <Plus className="w-5 h-5 text-foreground" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold">Add New Tool</CardTitle>
                                    <CardDescription>Index a tool or resource to your knowledge base.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 py-8">
                            {error && (
                                <Alert variant="destructive" className="mb-6 rounded-xl">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <ToolForm
                                key={extractedData ? JSON.stringify(extractedData) : 'manual'}
                                initialData={extractedData || undefined}
                                onSubmit={handleCreate}
                                isLoading={isLoading}
                                submitLabel="Save Tool to Index"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SidebarInset>
    );
}
