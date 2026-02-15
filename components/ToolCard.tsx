'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Edit2,
    ExternalLink,
    MoreVertical,
    Star,
    Trash,
    Zap,
    Tag
} from 'lucide-react';
import { Tool } from '@/types/tool';
import { cn } from "@/components/ui/utils";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ToolCardProps {
    tool: Tool;
    onFavoriteToggle?: (tool: Tool) => void;
    onDelete?: (toolId: string) => void;
}

export default function ToolCard({ tool, onFavoriteToggle, onDelete }: ToolCardProps) {
    const router = useRouter();

    const handleFavorite = async (event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            const res = await fetch(`/api/tools/${tool.id}/favorite`, { method: 'PATCH' });
            if (res.ok) {
                const updated = await res.json();
                onFavoriteToggle?.(updated);
            }
        } catch (error) {
            console.error('Failed to toggle favorite', error);
        }
    };

    const handleDelete = async (event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            const res = await fetch(`/api/tools/${tool.id}`, { method: 'DELETE' });
            if (res.ok) {
                onDelete?.(tool.id);
            }
        } catch (error) {
            console.error('Failed to delete tool', error);
        }
    };

    const usageCount = tool.usage_count || 0;

    return (
        <Card
            className="group relative h-full flex flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30"
            onClick={() => router.push(`/tools/${tool.id}`)}
        >
            <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                                {tool.category}
                            </Badge>
                            {tool.is_favorite && (
                                <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                                    <Star className="w-2.5 h-2.5 mr-1 fill-accent" />
                                    Favorite
                                </Badge>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {tool.name}
                        </h3>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-8 w-8 rounded-full",
                                tool.is_favorite ? "text-accent" : "text-muted-foreground"
                            )}
                            onClick={handleFavorite}
                        >
                            <Star className={cn("h-4 w-4", tool.is_favorite && "fill-accent")} />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36 rounded-xl border-border/50 bg-popover/80 backdrop-blur-xl">
                                <DropdownMenuItem onClick={() => router.push(`/tools/${tool.id}`)}>
                                    <Edit2 className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                                    <Trash className="w-3.5 h-3.5 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-5 pb-4 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                    {tool.description || 'No description provided.'}
                </p>

                {tool.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {tool.tags.slice(0, 3).map((tag) => (
                            <div key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/50 text-[11px] font-medium text-muted-foreground">
                                <Tag className="w-3 h-3" />
                                {tag}
                            </div>
                        ))}
                        {tool.tags.length > 3 && (
                            <span className="text-[10px] text-muted-foreground self-center">+{tool.tags.length - 3} more</span>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="px-5 py-4 border-t border-border/50 bg-muted/20">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Relevance</span>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                    key={level}
                                    className={cn(
                                        "h-1.5 w-6 rounded-full transition-all duration-500",
                                        level <= tool.relevance_score
                                            ? "bg-primary shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                                            : "bg-border"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                        <Zap className="w-3 h-3 text-primary" />
                        <span>{usageCount} uses</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
