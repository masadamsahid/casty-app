"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyCastings, type Casting } from "@/lib/api/castings";
import { getMe } from "@/lib/api/user";
import CastingCard from "@/components/castings/casting-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function MyCastingsPage() {
    const router = useRouter();

    const [castings, setCastings] = useState<Casting[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchMyCastings = async () => {
            setLoading(true);
            try {
                // 1. Get current user (to verify login)
                const userRes = await getMe();
                if (!userRes) {
                    router.push("/login?callbackUrl=/my-casting-posts");
                    return;
                }
                setUser(userRes);

                // 2. Fetch castings from secured endpoint
                const response = await getMyCastings();
                if (response.success) {
                    if (Array.isArray(response.data)) {
                        setCastings(response.data);
                    } else if (response.data && Array.isArray(response.data.data)) {
                        setCastings(response.data.data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch my castings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyCastings();
    }, [router]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">My Casting Posts</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage all the castings you have created.
                    </p>
                </div>
                {/* Reusing the Logic from Listings Page if we had a button component there, but for now linking to create path or just visually showing it */}
                <Button onClick={() => router.push("/castings?action=create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Post Casting
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-[200px] w-full rounded-xl" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : castings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {castings.map((casting) => (
                        <CastingCard key={casting.id} casting={casting} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
                    <h2 className="text-2xl font-semibold opacity-50">You haven't posted any castings yet</h2>
                    <Button variant="link" className="mt-4" onClick={() => router.push("/castings?action=create")}>
                        Create your first casting
                    </Button>
                </div>
            )}
        </div>
    );
}
