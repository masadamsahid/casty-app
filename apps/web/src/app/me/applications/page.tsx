"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyApplications, type Application } from "@/lib/api/applications";
import { getMe } from "@/lib/api/user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { MessageSquare, Info, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function MyApplicationsPage() {
    const router = useRouter();

    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchMyApplications = async () => {
            setLoading(true);
            try {
                const userRes = await getMe();
                if (!userRes.success) {
                    router.push("/login?callbackUrl=/me/applications");
                    return;
                }
                setUser(userRes.data);

                const response = await getMyApplications();
                if (response.success) {
                    setApplications(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch my applications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyApplications();
    }, [router]);

    const filteredApplications = applications.filter(app =>
        app.casting?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">My Applications</h1>
                    <p className="text-muted-foreground mt-2">
                        Track all the castings you have applied for.
                    </p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by casting title..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-xl" />
                    ))}
                </div>
            ) : filteredApplications.length > 0 ? (
                <div className="grid gap-4">
                    {filteredApplications.map((app) => (
                        <div key={app.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-card border rounded-2xl hover:shadow-md transition-all group">
                            <div className="flex-1 space-y-1 mb-4 md:mb-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant={
                                        app.status === "accepted" ? "success" :
                                            app.status === "rejected" ? "destructive" :
                                                app.status === "shortlisted" ? "secondary" : "outline"
                                    } className="capitalize">
                                        {app.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        Applied {format(new Date(app.createdAt), "MMM d, yyyy")}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                    {app.casting?.title}
                                </h3>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                    {app.casting?.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {app.casting.location}
                                        </div>
                                    )}
                                    {app.agency && (
                                        <div className="flex items-center gap-1">
                                            <Building2Icon className="w-3 h-3" />
                                            {app.agency.name}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <Button variant="outline" asChild className="flex-1 md:flex-none">
                                    <Link href={`/applications/${app.id}` as any}>
                                        <Info className="w-4 h-4 mr-2" />
                                        Details
                                    </Link>
                                </Button>
                                <Button size="icon" variant="ghost" className="hidden md:flex group-hover:bg-primary group-hover:text-primary-foreground rounded-full transition-all" asChild>
                                    <Link href={`/applications/${app.id}` as any}>
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-muted/20 border-2 border-dashed rounded-3xl">
                    <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border shadow-sm">
                        <Search className="w-8 h-8 text-muted-foreground opacity-20" />
                    </div>
                    <h2 className="text-2xl font-semibold opacity-50">No applications found</h2>
                    <p className="text-muted-foreground mt-2">
                        {searchQuery ? "Try searching for something else." : "Browse castings and start applying today!"}
                    </p>
                    <Button variant="default" className="mt-6" onClick={() => router.push("/castings")}>
                        Browse Castings
                    </Button>
                </div>
            )}
        </div>
    );
}

function MapPin({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
    )
}

function Building2Icon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
    )
}
