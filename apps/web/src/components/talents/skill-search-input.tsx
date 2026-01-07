"use client";

import { useState, useEffect, useCallback } from "react";
import { Input as UiInput } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Search, Loader2 } from "lucide-react";
import { searchSkills } from "@/lib/api/talents";

interface Skill {
    id: string;
    name: string;
}

interface SkillSearchInputProps {
    selectedSkillIds: string[];
    onChange: (skillIds: string[]) => void;
}

export default function SkillSearchInput({ selectedSkillIds, onChange }: SkillSearchInputProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const response = await searchSkills(query);
                if (response.success) {
                    setResults(response.data);
                }
            } catch (error) {
                console.error("Failed to search skills:", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (skill: Skill) => {
        if (!selectedSkillIds.includes(skill.id)) {
            const newIds = [...selectedSkillIds, skill.id];
            onChange(newIds);
            setSelectedSkills([...selectedSkills, skill]);
        }
        setQuery("");
        setResults([]);
    };

    const handleRemove = (skillId: string) => {
        const newIds = selectedSkillIds.filter((id: string) => id !== skillId);
        onChange(newIds);
        setSelectedSkills(selectedSkills.filter((s) => s.id !== skillId));
    };

    return (
        <div className="space-y-2 relative">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Skills (AND)</label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <UiInput
                    placeholder="Search skills..."
                    className="pl-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                )}
            </div>
            {results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border-2 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                    {results.map((skill) => (
                        <button
                            key={skill.id}
                            className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm"
                            onClick={() => handleSelect(skill)}
                        >
                            {skill.name}
                        </button>
                    ))}
                </div>
            )}
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedSkills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="gap-1 px-2 py-1">
                        {skill.name}
                        <button
                            type="button"
                            onClick={() => handleRemove(skill.id)}
                            className="hover:text-destructive transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    );
}
