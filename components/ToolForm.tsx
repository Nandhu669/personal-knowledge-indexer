'use client';

import * as React from 'react';
import { CATEGORIES, ToolFormData } from '@/types/tool';
import { cn } from "@/components/ui/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Star } from 'lucide-react';

interface ToolFormProps {
    initialData?: Partial<ToolFormData>;
    onSubmit: (data: ToolFormData) => Promise<void>;
    isLoading?: boolean;
    submitLabel?: string;
}

export default function ToolForm({
    initialData,
    onSubmit,
    isLoading = false,
    submitLabel = 'Save Tool',
}: ToolFormProps) {
    const [formData, setFormData] = React.useState<ToolFormData>({
        name: initialData?.name || '',
        category: initialData?.category || 'Other',
        website: initialData?.website || '',
        description: initialData?.description || '',
        use_case: initialData?.use_case || '',
        relevance_score: initialData?.relevance_score || 3,
        tags: initialData?.tags || [],
        source_link: initialData?.source_link || '',
    });
    const [tagInput, setTagInput] = React.useState('');
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const validate = () => {
        const nextErrors: Record<string, string> = {};
        if (!formData.name.trim()) nextErrors.name = 'Name is required';
        if (formData.relevance_score < 1 || formData.relevance_score > 5) {
            nextErrors.relevance_score = 'Must be between 1 and 5';
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validate()) return;
        await onSubmit(formData);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const addTags = () => {
        const newTags = tagInput
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag && !formData.tags.includes(tag));
        if (newTags.length > 0) {
            setFormData((prev) => ({ ...prev, tags: [...prev.tags, ...newTags] }));
        }
        setTagInput('');
    };

    const removeTag = (tag: string) => {
        setFormData((prev) => ({ ...prev, tags: prev.tags.filter((item) => item !== tag) }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        Tool Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., ChatGPT, Figma, VS Code"
                        className={cn(
                            "rounded-xl border-border/50 bg-background/50 h-12 focus:ring-primary/20",
                            errors.name && "border-destructive/50 focus:ring-destructive/20"
                        )}
                    />
                    {errors.name && <p className="text-xs font-bold text-destructive uppercase tracking-widest mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                            Primary Category
                        </Label>
                        <Select
                            value={formData.category}
                            onValueChange={(val) => handleSelectChange('category', val)}
                        >
                            <SelectTrigger className="rounded-xl border-border/50 bg-background/50 h-12 focus:ring-primary/20">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/50 bg-popover/80 backdrop-blur-xl">
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat} className="rounded-lg">
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                            Relevance Score
                        </Label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((score) => (
                                <button
                                    key={score}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, relevance_score: score }))}
                                    className={cn(
                                        "flex-1 h-12 rounded-xl border border-border/50 transition-all duration-300 font-bold",
                                        score <= formData.relevance_score
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-primary"
                                            : "bg-background/20 text-muted-foreground hover:bg-muted/50"
                                    )}
                                >
                                    {score}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="website" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                            Offical Website
                        </Label>
                        <Input
                            id="website"
                            name="website"
                            type="url"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://tool-name.com"
                            className="rounded-xl border-border/50 bg-background/50 h-12 focus:ring-primary/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="source_link" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                            Discovery Source
                        </Label>
                        <Input
                            id="source_link"
                            name="source_link"
                            type="url"
                            value={formData.source_link}
                            onChange={handleChange}
                            placeholder="URL where you found it"
                            className="rounded-xl border-border/50 bg-background/50 h-12 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        Core Description
                    </Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="A concise summary of what this tool does best..."
                        className="rounded-xl border-border/50 bg-background/50 focus:ring-primary/20 resize-none py-3"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="use_case" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        Personal Use Case
                    </Label>
                    <Textarea
                        id="use_case"
                        name="use_case"
                        value={formData.use_case}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Specific projects or workflows you'll use this for..."
                        className="rounded-xl border-border/50 bg-background/50 focus:ring-primary/20 resize-none py-3"
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="tagInput" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        Tags & Metadata
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="tagInput"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTags();
                                }
                            }}
                            placeholder="Add labels (e.g. freemium, desktop, beta)"
                            className="rounded-xl border-border/50 bg-background/50 h-12 focus:ring-primary/20 flex-1"
                        />
                        <Button
                            type="button"
                            onClick={addTags}
                            variant="secondary"
                            className="h-12 px-6 rounded-xl font-bold bg-muted/50 hover:bg-muted"
                        >
                            Add
                        </Button>
                    </div>
                    {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {formData.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="rounded-lg border-border/50 bg-muted/30 px-3 py-1.5 flex items-center gap-2 group hover:bg-background transition-colors"
                                >
                                    <span className="text-xs font-bold text-foreground/80">{tag}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Plus className="w-5 h-5 animate-spin" />
                            Processing...
                        </span>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </div>
        </form>
    );
}
