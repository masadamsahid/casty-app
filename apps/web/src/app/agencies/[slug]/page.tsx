"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAgencyById } from "@/lib/api/agencies";
import AgencyHeader from "@/components/agencies/agency-header";
import MembersList from "@/components/agencies/members-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function AgencyDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [agency, setAgency] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    //   const { user } = useAuth(); // Implement if available, otherwise mock or fetch

    const fetchAgency = async () => {
        try {
            setLoading(true);
            const response = await getAgencyById(slug);
            if (response.success) {
                setAgency(response.data);
            } else {
                setError(response.message || "Failed to load agency");
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "Failed to load agency");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchAgency();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-48 w-full rounded-3xl mb-24" />
                <div className="flex gap-6">
                    <Skeleton className="w-40 h-40 rounded-3xl" />
                    <div className="flex-1 space-y-4 pt-12">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !agency) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">Agency Not Found</h1>
                <p className="text-muted-foreground">{error || "The agency you are looking for does not exist."}</p>
            </div>
        );
    }

    // TODO: Implement proper owner check using auth context
    // For now assuming false or check if we had user info
    const isOwner = false;

    return (
        <div className="min-h-screen pb-20">
            <AgencyHeader agency={agency} isOwner={isOwner} />

            <div className="container mx-auto px-4">
                <Tabs defaultValue="members" className="space-y-6">
                    <TabsList className="bg-muted/50 p-1 rounded-xl">
                        <TabsTrigger value="members" className="rounded-lg">Members</TabsTrigger>
                        <TabsTrigger value="castings" className="rounded-lg">Castings</TabsTrigger>
                        <TabsTrigger value="about" className="rounded-lg">About</TabsTrigger>
                    </TabsList>

                    <TabsContent value="members" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">Team Members</h2>
                            <span className="text-sm text-muted-foreground">{agency.members?.length || 0} members</span>
                        </div>
                        <MembersList members={agency.members || []} />
                    </TabsContent>

                    <TabsContent value="castings" className="min-h-[200px] flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
                        <div className="text-center">
                            <p className="font-medium">No active casting calls</p>
                            <p className="text-sm">This agency hasn't posted any public castings yet.</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="about">
                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-xl font-bold mb-4">About {agency.name}</h3>
                            <p className="whitespace-pre-wrap leading-relaxed">
                                {agency.description || "No description provided."}
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
