"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getCastings, type CastingFilters, type Casting } from "@/lib/api/castings";
import { Search } from "lucide-react";
import CastingCard from "@/components/castings/casting-card";
import CastingFiltersComponent from "@/components/castings/casting-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function CastingsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [castings, setCastings] = useState<Casting[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const initialFiltersFromUrl = useMemo(() => {
        // Enforce PUBLISHED status per project plan (Feature #5)
        const filters: CastingFilters = { limit: 12, offset: 0, status: "published" };
        searchParams.forEach((value, key) => {
            const cleanKey = key.replace("[]", "");
            if (cleanKey === "skillIds") {
                filters.skillIds = filters.skillIds || [];
                if (!filters.skillIds.includes(value)) {
                    filters.skillIds.push(value);
                }
            } else if (key === "limit" || key === "offset" || key.includes("min") || key.includes("max")) {
                (filters as any)[cleanKey] = Number(value);
            }
            else {
                (filters as any)[cleanKey] = value;
            }
        });
        return filters;
    }, [searchParams]);

    const [filters, setFilters] = useState<CastingFilters>(initialFiltersFromUrl);

    const updateUrl = (newFilters: CastingFilters) => {
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                if (Array.isArray(value)) {
                    value.forEach((v) => params.append(`${key}[]`, v));
                } else {
                    params.append(key, value.toString());
                }
            }
        });
        router.push(`${pathname}?${params.toString()}` as any);
    };

    const fetchCastings = async (currentFilters: CastingFilters) => {
        setLoading(true);
        try {
            const response = await getCastings(currentFilters);
            if (response.success) {
                // Backend currently returns the array directly in data
                if (Array.isArray(response.data)) {
                    setCastings(response.data);
                    setTotal(response.data.length);
                } else if (response.data && Array.isArray(response.data.data)) {
                    // Handle potential future structure with pagination metadata
                    setCastings(response.data.data);
                    setTotal(response.data.total || response.data.data.length);
                }
            }
        } catch (error) {
            console.error("Failed to fetch castings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCastings(filters);
    }, [filters]);

    useEffect(() => {
        setFilters(initialFiltersFromUrl);
    }, [initialFiltersFromUrl]);

    const handleFilterChange = (newFilters: CastingFilters) => {
        const updated: CastingFilters = { ...newFilters, limit: 12, offset: 0, status: "published" };
        setFilters(updated);
        updateUrl(updated);
    };

    const handlePageChange = (offset: number) => {
        const updated = { ...filters, offset };
        setFilters(updated);
        updateUrl(updated);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const totalPages = Math.ceil(total / 12);
    const currentPage = Math.floor((filters.offset || 0) / 12) + 1;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Browse Castings</h1>
                    <p className="text-muted-foreground mt-2">
                        Find the perfect role for you. Filter by category, location, and more.
                    </p>
                </div>
                <div className="text-sm font-medium">
                    Showing <span className="text-primary">{Math.min(total, (filters.offset || 0) + 1)}</span> -{" "}
                    <span className="text-primary">{Math.min(total, (filters.offset || 0) + castings.length)}</span> of{" "}
                    <span className="text-primary">{total}</span> castings
                </div>
            </div>

            <CastingFiltersComponent onFilterChange={handleFilterChange} initialFilters={filters} />

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-[200px] w-full rounded-xl" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : castings.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {castings.map((casting) => (
                            <CastingCard key={casting.id} casting={casting} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage > 1) handlePageChange(((currentPage - 2) * 12));
                                            }}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const page = i + 1;
                                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={page === currentPage}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handlePageChange(i * 12);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                                            return <PaginationItem key={page}>...</PaginationItem>;
                                        }
                                        return null;
                                    })}
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage < totalPages) handlePageChange(currentPage * 12);
                                            }}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-muted rounded-full">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-semibold opacity-50">No castings found</h2>
                    <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
                </div>
            )}
        </div>
    );
}
