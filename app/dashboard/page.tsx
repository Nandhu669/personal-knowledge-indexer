'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Database, Plus } from 'lucide-react';
import { Tool } from '@/types/tool';
import ToolCard from '@/components/ToolCard';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import { SidebarInset } from "@/components/ui/sidebar";
import { useDashboard } from '@/contexts/DashboardContext';

interface ToolsResponse {
    tools: Tool[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function DashboardPage() {
    const { currentView } = useDashboard();

    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('relevance');
    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const effectiveFavorites = currentView === 'favorites' ? true : favoritesOnly;

    const fetchTools = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (category) params.set('category', category);
            if (sort) params.set('sort', sort);
            if (effectiveFavorites) params.set('favorites', 'true');
            if (currentView === 'archived') params.set('archived', 'true');
            params.set('page', page.toString());
            params.set('limit', '12');

            const res = await fetch(`/api/tools?${params.toString()}`);
            if (!res.ok) return;
            const data: ToolsResponse = await res.json();
            setTools(data.tools || []);
            setTotalPages(data.totalPages || 1);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Failed to fetch tools:', error);
        } finally {
            setIsLoading(false);
        }
    }, [search, category, sort, effectiveFavorites, page, currentView]);

    useEffect(() => {
        fetchTools();
    }, [fetchTools]);

    useEffect(() => {
        setPage(1);
    }, [search, category, sort, favoritesOnly, currentView]);

    const handleFavoriteToggle = (updatedTool: Tool) => {
        setTools((prev) => prev.map((tool) => (tool.id === updatedTool.id ? updatedTool : tool)));
    };

    const handleDelete = (toolId: string) => {
        setTools((prev) => prev.filter((tool) => tool.id !== toolId));
        setTotal((prev) => Math.max(0, prev - 1));
    };

    const renderContent = () => {
        if (currentView === 'settings') {
            return (
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl px-12 py-10 text-center shadow-2xl shadow-primary/5">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Database className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
                        <p className="text-muted-foreground max-w-xs">Configuration and user preferences will be available here soon.</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex-1 overflow-y-auto px-10 py-8">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse rounded-3xl border border-border/50 bg-card/50 h-[220px]"
                            />
                        ))}
                    </div>
                ) : tools.length === 0 ? (
                    <div className="h-full min-h-[420px] flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                            <Database className="w-12 h-12 text-muted-foreground/50" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-2">No tools found</h3>
                        <p className="text-muted-foreground mb-8 max-w-sm">We couldn't find any tools matching your criteria. Try adjusting your filters or add a new tool.</p>
                        <Link
                            href="/tools/new"
                            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" strokeWidth={3} />
                            Add Your First Tool
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {tools.map((tool) => (
                                <ToolCard
                                    key={tool.id}
                                    tool={tool}
                                    onFavoriteToggle={handleFavoriteToggle}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-2 pb-8">
                                <button
                                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-xl border border-border/50 bg-muted/50 text-sm font-semibold text-muted-foreground hover:bg-muted transition-all disabled:opacity-30"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                                        let pageNum: number;
                                        if (totalPages <= 5) pageNum = index + 1;
                                        else if (page <= 3) pageNum = index + 1;
                                        else if (page >= totalPages - 2) pageNum = totalPages - 4 + index;
                                        else pageNum = page - 2 + index;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${page === pageNum
                                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                                    : 'border border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 rounded-xl border border-border/50 bg-muted/50 text-sm font-semibold text-muted-foreground hover:bg-muted transition-all disabled:opacity-30"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    return (
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
            <Header
                currentView={currentView}
                onSearchChange={setSearch}
            />

            <SearchBar
                onCategoryChange={setCategory}
                onSortChange={setSort}
                onFavoritesChange={setFavoritesOnly}
                currentCategory={category}
                currentSort={sort}
                favoritesOnly={effectiveFavorites}
                toolCount={total}
            />

            {renderContent()}
        </SidebarInset>
    );
}
