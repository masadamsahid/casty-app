"use client";

import { useEffect, useState } from "react";
import { getAgencies } from "@/lib/api/agencies";
import AgencyCard from "@/components/agencies/agency-card";
import CreateAgencyModal from "@/components/agencies/create-agency-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AgenciesPage() {
    const [agencies, setAgencies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchAgencies = async () => {
        setLoading(true);
        try {
            const response = await getAgencies();
            if (response.success) {
                setAgencies(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch agencies:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgencies();
    }, []);

    const filteredAgencies = agencies.filter((agency) =>
        agency.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Agencies</h1>
                    <p className="text-muted-foreground text-lg">
                        Connect with top talent agencies management worldwide.
                    </p>
                </div>
                <CreateAgencyModal />
            </div>

            <div className="relative mb-10 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                    placeholder="Search agencies by name..."
                    className="pl-12 h-14 text-lg rounded-2xl border-2 focus-visible:ring-primary shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-video w-full rounded-3xl" />
                            <div className="space-y-2 px-2">
                                <Skeleton className="h-6 w-2/3 rounded-full" />
                                <Skeleton className="h-4 w-full rounded-full" />
                                <Skeleton className="h-4 w-1/2 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredAgencies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAgencies.map((agency) => (
                        <AgencyCard key={agency.id} agency={agency} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-muted/30 rounded-[2.5rem] border-4 border-dashed">
                    <div className="mx-auto w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6">
                        <Search className="w-10 h-10 text-muted-foreground opacity-20" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">No agencies found</h2>
                    <p className="text-muted-foreground mt-3 text-lg">
                        {searchQuery ? `No results for "${searchQuery}"` : "Try building your own agency today!"}
                    </p>
                </div>
            )}
        </div>
    );
}
