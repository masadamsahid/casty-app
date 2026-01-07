"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getTalents, type TalentFilters } from "@/lib/api/talents";
import TalentCard from "@/components/talents/talent-card";
import TalentFiltersComponent from "@/components/talents/talent-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

function TalentsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [talents, setTalents] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const initialFiltersFromUrl = useMemo(() => {
        const filters: TalentFilters = { limit: 12, offset: 0 };
        searchParams.forEach((value, key) => {
            const cleanKey = key.replace("[]", "");
            if (cleanKey === "skillIds") {
                filters.skillIds = filters.skillIds || [];
                if (!filters.skillIds.includes(value)) {
                    filters.skillIds.push(value);
                }
            } else if (key === "limit" || key === "offset" || key.includes("min") || key.includes("max") || key === "age" || key === "experience") {
                (filters as any)[cleanKey] = Number(value);
            } else {
                (filters as any)[cleanKey] = value;
            }
        });
        return filters;
    }, [searchParams]);

    const [filters, setFilters] = useState<TalentFilters>(initialFiltersFromUrl);

    const updateUrl = (newFilters: TalentFilters) => {
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

    const fetchTalents = async (currentFilters: TalentFilters) => {
        setLoading(true);
        try {
            const response = await getTalents(currentFilters);
            if (response.success) {
                setTalents(response.data.data);
                setTotal(response.data.total);
            }
        } catch (error) {
            console.error("Failed to fetch talents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTalents(filters);
    }, [filters]);

    useEffect(() => {
        setFilters(initialFiltersFromUrl);
    }, [initialFiltersFromUrl]);

    const handleFilterChange = (newFilters: TalentFilters) => {
        const updated = { ...newFilters, limit: 12, offset: 0 };
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
    const currentPage = Math.floor(filters.offset! / 12) + 1;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Discover Talents</h1>
                    <p className="text-muted-foreground mt-2">
                        Browse through our community of professional talents and find the perfect match for your project.
                    </p>
                </div>
                <div className="text-sm font-medium">
                    Showing <span className="text-primary">{Math.min(total, filters.offset! + 1)}</span> -{" "}
                    <span className="text-primary">{Math.min(total, filters.offset! + talents.length)}</span> of{" "}
                    <span className="text-primary">{total}</span> talents
                </div>
            </div>

            <TalentFiltersComponent onFilterChange={handleFilterChange} initialFilters={filters} />

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-3/4 w-full rounded-xl" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : talents.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {talents.map((talent) => (
                            <TalentCard key={talent.id} talent={talent} />
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
                                                if (currentPage > 1) handlePageChange((currentPage - 2) * 12);
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
                    <h2 className="text-2xl font-semibold opacity-50">No talents found</h2>
                    <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
                </div>
            )}
        </div>
    );
}

export default function TalentsPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-3/4 w-full rounded-xl" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        }>
            <TalentsContent />
        </Suspense>
    );
}
