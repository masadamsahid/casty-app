"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { TalentFilters } from "@/lib/api/talents";

interface TalentFiltersProps {
    onFilterChange: (filters: TalentFilters) => void;
    initialFilters?: TalentFilters;
}

export default function TalentFiltersComponent({ onFilterChange, initialFilters = {} }: TalentFiltersProps) {
    const [filters, setFilters] = useState<TalentFilters>(initialFilters);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleApply = () => {
        onFilterChange(filters);
    };

    const handleReset = () => {
        const reset = {};
        setFilters(reset);
        onFilterChange(reset);
    };

    const updateFilter = (key: keyof TalentFilters, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-4 mb-8 bg-card p-4 rounded-xl border-2 shadow-sm">
            <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name..."
                        className="pl-10"
                        value={filters.name || ""}
                        onChange={(e) => updateFilter("name", e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleApply()}
                    />
                </div>
                <Select
                    value={filters.gender || "all"}
                    onValueChange={(val) => updateFilter("gender", val === "all" ? undefined : val)}
                >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Genders</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={filters.sortBy || "newest"}
                    onValueChange={(val) => updateFilter("sortBy", val === "newest" ? undefined : val)}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="age">Age</SelectItem>
                        <SelectItem value="height">Height</SelectItem>
                        <SelectItem value="experience">Experience</SelectItem>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t-2 border-dashed">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Height (cm)</label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={filters.minHeight || ""}
                                onChange={(e) => updateFilter("minHeight", e.target.value ? Number(e.target.value) : undefined)}
                            />
                            <Input
                                type="number"
                                placeholder="Max"
                                value={filters.maxHeight || ""}
                                onChange={(e) => updateFilter("maxHeight", e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={filters.minAge || ""}
                                onChange={(e) => updateFilter("minAge", e.target.value ? Number(e.target.value) : undefined)}
                            />
                            <Input
                                type="number"
                                placeholder="Max"
                                value={filters.maxAge || ""}
                                onChange={(e) => updateFilter("maxAge", e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Experience (yrs)</label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={filters.minExperience || ""}
                                onChange={(e) => updateFilter("minExperience", e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Country</label>
                        <Input
                            placeholder="Country name..."
                            value={filters.country || ""}
                            onChange={(e) => updateFilter("country", e.target.value)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
