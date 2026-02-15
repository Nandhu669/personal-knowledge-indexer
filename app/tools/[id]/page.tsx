'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, Pencil, Plus, Star, Trash2, ExternalLink, Calendar, MousePointer2, Layout } from 'lucide-react';
import ToolForm from '@/components/ToolForm';
import { Tool, ToolFormData } from '@/types/tool';
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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/components/ui/utils";

interface ToolDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function ToolDetailPage({ params }: ToolDetailPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { currentView } = useDashboard();
    const [tool, setTool] = useState<Tool | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTool = async () => {
            try {
                const res = await fetch(`/api/tools/${id}`);
                if (res.ok) {
                    setTool(await res.json());
                } else {
                    setError('Tool not found');
                }
            } catch {
                setError('Failed to load tool');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTool();
    }, [id]);

    const handleUpdate = async (data: ToolFormData) => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/tools/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                setTool(await res.json());
                setIsEditing(false);
            }
        } catch {
            console.error('Failed to update tool');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/tools/${id}`, { method: 'DELETE' });
            if (res.ok) router.push('/dashboard');
        } catch {
            console.error('Failed to delete tool');
        }
    };

    const handleFavoriteToggle = async () => {
        try {
            const res = await fetch(`/api/tools/${id}/favorite`, { method: 'PATCH' });
            if (res.ok) setTool(await res.json());
        } catch {
            console.error('Failed to toggle favorite');
        }
    };

    const handleUsageIncrement = async () => {
        try {
            const res = await fetch(`/api/tools/${id}/usage`, { method: 'PATCH' });
            if (res.ok) setTool(await res.json());
        } catch {
            console.error('Failed to increment usage');
        }
    };

    if (isLoading) {
        return (
            <SidebarInset className="flex flex-col h-screen overflow-hidden">
                <Header currentView={currentView} />
                <div className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="mx-auto max-w-3xl animate-pulse">
                        <div className="h-5 w-36 rounded bg-muted mb-8" />
                        <Card className="border-border/50 bg-card/50">
                            <CardHeader className="h-40" />
                            <CardContent className="h-60" />
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        );
    }

    if (error || !tool) {
        return (
            <SidebarInset className="flex flex-col h-screen overflow-hidden">
                <Header currentView={currentView} />
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <div className="p-4 rounded-full bg-destructive/10 mb-4">
                        <AlertTriangle className="w-12 h-12 text-destructive" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">{error || 'Tool not found'}</h2>
                    <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                        The resource you are looking for might have been removed or renamed.
                    </p>
                    <Button asChild variant="secondary" className="mt-8 rounded-xl font-bold">
                        <Link href="/dashboard">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return to Dashboard
                        </Link>
                    </Button>
                </div>
            </SidebarInset>
        );
    }

    return (
        <SidebarInset className="flex flex-col h-screen overflow-hidden text-foreground">
            <Header currentView={currentView} />

            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
                <div className="mx-auto max-w-4xl">
                    <Link
                        href="/dashboard"
                        className="mb-8 inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        BACK TO INDEX
                    </Link>

                    {isEditing ? (
                        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-muted border border-border/50 text-foreground">
                                            <Pencil className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold">Edit Tool Configuration</CardTitle>
                                            <CardDescription>Update metadata and labels for this indexed resource.</CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsEditing(false)}
                                        className="rounded-xl font-bold text-muted-foreground hover:text-foreground"
                                    >
                                        Cancel Changes
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="px-8 py-8">
                                <ToolForm
                                    initialData={{
                                        name: tool.name,
                                        category: tool.category,
                                        website: tool.website || '',
                                        description: tool.description || '',
                                        use_case: tool.use_case || '',
                                        relevance_score: tool.relevance_score,
                                        tags: tool.tags || [],
                                        source_link: tool.source_link || '',
                                    }}
                                    onSubmit={handleUpdate}
                                    isLoading={isSaving}
                                    submitLabel="Commit Updates"
                                />
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-8">
                            <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden rounded-[2.5rem] p-4 md:p-8">
                                {/* Glassmorphism Background Decoration */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                        <div className="space-y-4">
                                            <Badge variant="secondary" className="rounded-lg bg-primary/20 text-primary border-primary/20 font-black tracking-widest px-3 py-1 text-[10px] uppercase">
                                                {tool.category}
                                            </Badge>
                                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-foreground">{tool.name}</h1>

                                            <div className="flex items-center gap-4 pt-2">
                                                <div className="flex items-center gap-1 bg-muted/50 rounded-full px-3 py-1.5 border border-border/50">
                                                    <Star className="w-4 h-4 text-primary fill-primary" />
                                                    <span className="text-sm font-bold">{tool.relevance_score}/5</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-muted-foreground text-sm font-medium">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Added {new Date(tool.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={handleFavoriteToggle}
                                                variant="outline"
                                                size="icon"
                                                className={cn(
                                                    "h-12 w-12 rounded-2xl border-border/50 backdrop-blur-md transition-all",
                                                    tool.is_favorite
                                                        ? "bg-accent/20 border-accent/30 text-accent shadow-lg shadow-accent/10"
                                                        : "bg-background/50 hover:bg-background"
                                                )}
                                            >
                                                <Star className="h-6 w-6" fill={tool.is_favorite ? "currentColor" : "none"} />
                                            </Button>
                                            <Button
                                                onClick={() => setIsEditing(true)}
                                                variant="outline"
                                                size="icon"
                                                className="h-12 w-12 rounded-2xl border-border/50 bg-background/50 backdrop-blur-md transition-all hover:bg-background hover:scale-105"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                onClick={() => setShowDeleteConfirm(true)}
                                                variant="outline"
                                                size="icon"
                                                className="h-12 w-12 rounded-2xl border-border/50 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all hover:scale-105"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                                        <div className="lg:col-span-2 space-y-8">
                                            {tool.description && (
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">The Core Vision</Label>
                                                    <p className="text-lg leading-relaxed text-foreground/90 font-medium">{tool.description}</p>
                                                </div>
                                            )}

                                            {tool.use_case && (
                                                <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Strategic Use Case</Label>
                                                    <p className="text-md leading-relaxed text-foreground/80">{tool.use_case}</p>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-4">
                                                {tool.website && (
                                                    <Button asChild size="lg" className="rounded-2xl font-bold px-6 h-14 bg-foreground text-background hover:bg-foreground/90 shadow-xl">
                                                        <a href={tool.website} target="_blank" rel="noopener noreferrer">
                                                            Visit Platform
                                                            <ExternalLink className="w-4 h-4 ml-2" />
                                                        </a>
                                                    </Button>
                                                )}
                                                {tool.source_link && (
                                                    <Button asChild variant="outline" size="lg" className="rounded-2xl font-bold px-6 h-14 border-border/50 backdrop-blur-sm bg-background/50 hover:bg-background">
                                                        <a href={tool.source_link} target="_blank" rel="noopener noreferrer">
                                                            View Source
                                                            <ExternalLink className="w-4 h-4 ml-2" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            {tool.tags?.length > 0 && (
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Tags & Attributes</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {tool.tags.map((tag) => (
                                                            <Badge key={tag} variant="secondary" className="rounded-lg bg-background/50 border-border/50 px-3 py-1 text-xs font-bold text-foreground/70">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <Card className="rounded-3xl border-primary/20 bg-primary/5 p-6 space-y-4 shadow-inner">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/70">Total Engagement</Label>
                                                        <div className="text-3xl font-black text-primary tracking-tighter">{tool.usage_count} <span className="text-sm font-bold uppercase tracking-widest ml-1">uses</span></div>
                                                    </div>
                                                    <div className="p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                                        <MousePointer2 className="w-6 h-6" />
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={handleUsageIncrement}
                                                    className="w-full h-12 rounded-2xl bg-primary font-black uppercase tracking-widest text-xs hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                                >
                                                    Register New Usage
                                                </Button>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent className="rounded-3xl border-border/50 bg-background/80 backdrop-blur-2xl shadow-2xl p-8 max-w-md">
                    <AlertDialogHeader>
                        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight">Vaporize Tool?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground text-md leading-relaxed mt-2">
                            This will permanently remove <span className="font-bold text-foreground">&ldquo;{tool.name}&rdquo;</span> from your knowledge index. There is no recovery sequence.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
                        <AlertDialogCancel className="rounded-2xl h-12 flex-1 font-bold border-border/50 bg-background/50">Abort Mission</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="rounded-2xl h-12 flex-1 font-black uppercase tracking-widest bg-destructive text-white hover:bg-destructive/90"
                        >
                            Delete Forever
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SidebarInset>
    );
}
