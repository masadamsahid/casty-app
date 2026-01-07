"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { CastingFilters, CastingCategory } from "@/lib/api/castings";
import { getCategories } from "@/lib/api/castings";
import SkillSearchInput from "@/components/talents/skill-search-input";

interface CastingFiltersProps {
    onFilterChange: (filters: CastingFilters) => void;
    initialFilters?: CastingFilters;
}

export default function CastingFiltersComponent({ onFilterChange, initialFilters = {} }: CastingFiltersProps) {
    const [filters, setFilters] = useState<CastingFilters>(initialFilters);
    const [isExpanded, setIsExpanded] = useState(false);
    const [categories, setCategories] = useState<CastingCategory[]>([]);

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                if (res.success) {
                    setCategories(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        }
        fetchCategories();
    }, []);

    const handleApply = () => {
        onFilterChange(filters);
    };

    const handleReset = () => {
        const reset = {};
        setFilters(reset);
        onFilterChange(reset);
    };

    const updateFilter = (key: keyof CastingFilters, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-4 mb-8 bg-card p-4 rounded-xl border-2 shadow-sm">
            <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title..."
                        className="pl-10"
                        value={filters.title || ""}
                        onChange={(e) => updateFilter("title", e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleApply()}
                    />
                </div>

                {/* Category Filter */}
                <Select
                    value={filters.categoryId || "all"}
                    onValueChange={(val) => updateFilter("categoryId", val === "all" ? undefined : val)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Sort Filter */}
                <Select
                    value={filters.sortBy || "latest"}
                    onValueChange={(val) => updateFilter("sortBy", val === "latest" ? undefined : val)}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="latest">Latest</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="outline" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
                    <SlidersHorizontal className="w-4 h-4" />
                </Button>
                <Button onClick={handleApply}>Apply</Button>
                <Button variant="ghost" size="icon" onClick={handleReset}>
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {isExpanded && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t-2 border-dashed">
                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</label>
                            <Input
                                placeholder="e.g. New York"
                                value={filters.location || ""}
                                onChange={(e) => updateFilter("location", e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                            />
                        </div>
                        {/* Budget Placeholder - numeric range for filters usually hard, maybe just min budget */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min Budget</label>
                            <Input
                                type="number"
                                placeholder="e.g. 1000"
                                value={filters.minBudget || ""}
                                onChange={(e) => updateFilter("minBudget", e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t-2 border-dashed">
                        <SkillSearchInput
                            selectedSkillIds={filters.skillIds || []}
                            onChange={(skillIds: string[]) => updateFilter("skillIds", skillIds)}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
