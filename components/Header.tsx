'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { ViewType } from './Sidebar';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";

interface HeaderProps {
    currentView: ViewType;
    onSearchChange?: (search: string) => void;
}

const viewTitles: Record<ViewType, string> = {
    dashboard: 'Dashboard',
    favorites: 'Favorites',
    categories: 'Categories',
    archived: 'Archived',
    settings: 'Settings',
};

export default function Header({ currentView, onSearchChange }: HeaderProps) {
    const [localSearch, setLocalSearch] = React.useState('');
    const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => onSearchChange?.(localSearch), 300);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [localSearch, onSearchChange]);

    return (
        <div className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
            <div className="flex items-center justify-between px-6 h-16">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div className="h-6 w-[1px] bg-border/50 ml-1 mr-1" />
                    <h1 className="text-xl font-bold tracking-tight text-foreground">
                        {viewTitles[currentView]}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/tools/new">
                        <Button className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
                            <Plus className="h-4 w-4" strokeWidth={2.5} />
                            <span className="hidden sm:inline">Add Tool</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="px-6 pb-4">
                <div className="relative group max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Search tools by name, description, or tags..."
                        className="block w-full h-11 pl-11 pr-4 bg-muted/50 border border-border/50 rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all backdrop-blur-sm"
                    />
                </div>
            </div>
        </div>
    );
}
