"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyCastings, type Casting } from "@/lib/api/castings";
import { getMe } from "@/lib/api/user";
import CastingCard from "@/components/castings/casting-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CreateCastingDialog from "@/components/castings/create-casting-dialog";

export default function MyCastingsPage() {
    const router = useRouter();

    const [castings, setCastings] = useState<Casting[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchMyCastings = async () => {
        setLoading(true);
        try {
            const userRes = await getMe();
            if (!userRes.success) {
                router.push("/login?callbackUrl=/me/castings");
                return;
            }
            setUser(userRes.data);

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

    useEffect(() => {
        fetchMyCastings();
    }, [router]);

    const filteredCastings = castings.filter(casting =>
        casting.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">My Casting Posts</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage all the castings you have created and view applications.
                    </p>
                </div>
                <CreateCastingDialog
                    onSuccess={fetchMyCastings}
                    buttonText="Post New Casting"
                    className="rounded-full px-6"
                />
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search your castings..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-[300px] w-full rounded-2xl" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : filteredCastings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCastings.map((casting) => (
                        <CastingCard key={casting.id} casting={casting} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-muted/20 border-2 border-dashed rounded-3xl">
                    <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border shadow-sm">
                        <Plus className="w-8 h-8 text-muted-foreground opacity-20" />
                    </div>
                    <h2 className="text-2xl font-semibold opacity-50">No castings found</h2>
                    <p className="text-muted-foreground mt-2">
                        {searchQuery ? "Try searching for something else." : "You haven't posted any castings yet."}
                    </p>
                    <CreateCastingDialog
                        onSuccess={fetchMyCastings}
                        buttonText="Post your first casting"
                        className="mt-6"
                    />
                </div>
            )}
        </div>
    );
}
