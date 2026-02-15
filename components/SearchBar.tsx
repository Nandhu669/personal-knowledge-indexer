'use client';

import * as React from 'react';
import { Star, Filter, ArrowUpDown } from 'lucide-react';
import { cn } from "@/components/ui/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
    onCategoryChange: (category: string) => void;
    onSortChange: (sort: string) => void;
    onFavoritesChange: (favorites: boolean) => void;
    currentCategory: string;
    currentSort: string;
    favoritesOnly: boolean;
    toolCount?: number;
}

const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'Productivity', label: 'Productivity' },
    { value: 'AI Tools', label: 'AI Tools' },
    { value: 'Design Tools', label: 'Design' },
    { value: 'Dev Tools', label: 'Development' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Data & Analytics', label: 'Analytics' },
    { value: 'Communication', label: 'Communication' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Education', label: 'Education' },
    { value: 'Other', label: 'Other' },
];

const sortOptions = [
    { value: 'relevance', label: 'By Relevance' },
    { value: 'name', label: 'By Name' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'usage', label: 'Most Used' },
];

export default function SearchBar({
    onCategoryChange,
    onSortChange,
    onFavoritesChange,
    currentCategory,
    currentSort,
    favoritesOnly,
    toolCount,
}: SearchBarProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center px-6 py-4 bg-background/50 backdrop-blur-md border-b border-border/50">
            <div className="flex flex-wrap items-center gap-3 flex-1">
                <Select
                    value={currentCategory || 'all'}
                    onValueChange={(val) => onCategoryChange(val === 'all' ? '' : val)}
                >
                    <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-border/50 bg-muted/50 transition-all focus:ring-primary/20">
                        <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 bg-popover/80 backdrop-blur-xl">
                        {categoryOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={currentSort}
                    onValueChange={onSortChange}
                >
                    <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-border/50 bg-muted/50 transition-all focus:ring-primary/20">
                        <ArrowUpDown className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 bg-popover/80 backdrop-blur-xl">
                        {sortOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    onClick={() => onFavoritesChange(!favoritesOnly)}
                    className={cn(
                        "rounded-xl border-border/50 transition-all duration-300",
                        favoritesOnly
                            ? "bg-accent/10 border-accent/30 text-accent shadow-lg shadow-accent/5 hover:bg-accent/20"
                            : "bg-muted/50 hover:bg-muted"
                    )}
                >
                    <Star className={cn("w-4 h-4 mr-2", favoritesOnly && "fill-accent")} />
                    <span>Favorites</span>
                </Button>
            </div>

            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                {toolCount !== undefined ? `${toolCount} tools` : 'Loading...'}
            </div>
        </div>
    );
}
