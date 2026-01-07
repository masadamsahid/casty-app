"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCastingById, updateCasting, type Casting } from "@/lib/api/castings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Banknote, Building2, ArrowLeft, Ruler, Weight, Clock, Info, Edit } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { getMe } from "@/lib/api/user";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import CastingForm from "@/components/castings/casting-form";

export default function CastingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [casting, setCasting] = useState<Casting | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [castingRes, userRes] = await Promise.allSettled([
                    getCastingById(id),
                    getMe().catch(() => ({ data: null })), // Handle unauthenticated case
                ]);

                if (castingRes.status === "fulfilled" && castingRes.value.success) {
                    setCasting(castingRes.value.data);
                } else {
                    toast.error("Failed to load casting details");
                }

                if (userRes.status === "fulfilled" && userRes.value?.success) {
                    setUser(userRes.value.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleApply = () => {
        if (!user) {
            toast.error("You must be logged in to apply");
            router.push("/login"); // Assuming login route
            return;
        }
        if (!user.user?.isTalent) {
            toast.error("Only talents can apply for castings");
            return;
        }
        // TODO: Open application modal or navigate to application page
        toast.info("Application feature coming soon!");
    };

    const handleUpdate = async (values: any) => {
        setUpdating(true);
        try {
            const res = await updateCasting(id, values);
            if (res.success) {
                toast.success("Casting updated successfully");
                // Refresh casting data
                const updatedRes = await getCastingById(id);
                if (updatedRes.success) {
                    setCasting(updatedRes.data);
                }
                setEditDialogOpen(false);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update casting");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
                <Skeleton className="h-8 w-1/3" />
                <div className="space-y-4">
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
        );
    }

    if (!casting) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold">Casting not found</h1>
                <Button variant="link" onClick={() => router.push("/castings")}>Back to Castings</Button>
            </div>
        );
    }

    const isClosed = casting.status === "closed" || (!!casting.deadline && new Date(casting.deadline) < new Date());

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Castings
            </Button>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{casting.category.name}</Badge>
                        {casting.status === "draft" && (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/30">
                                Draft
                            </Badge>
                        )}
                        {isClosed ? (
                            <Badge variant="destructive">Closed</Badge>
                        ) : casting.status === "published" && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/30">
                                Published
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{casting.title}</h1>
                        {user?.user?.id === casting.managerId && (
                            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Edit Casting Call</DialogTitle>
                                    </DialogHeader>
                                    <CastingForm
                                        initialData={casting}
                                        onSubmit={handleUpdate}
                                        loading={updating}
                                    />
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    {casting.agency && (
                        <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg w-fit">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={casting.agency.logo} alt={casting.agency.name} />
                                <AvatarFallback>{casting.agency.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">Posted by</p>
                                <p className="font-semibold leading-none">{casting.agency.name}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3 min-w-[200px] bg-card p-4 rounded-xl border border-border shadow-sm">
                    {casting.deadline && (
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Deadline:</span>
                            <span>{format(new Date(casting.deadline), "MMM d, yyyy")}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Location:</span>
                        <span className="truncate max-w-[150px]">{casting.location || "Remote"}</span>
                    </div>
                    {casting.budget && (
                        <div className="flex items-center gap-2 text-sm">
                            <Banknote className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Budget:</span>
                            <span>{casting.budget}</span>
                        </div>
                    )}

                    <Separator className="my-2" />

                    <Button
                        size="lg"
                        className="w-full"
                        disabled={isClosed}
                        onClick={handleApply}
                    >
                        {isClosed ? "Applications Closed" : "Apply Now"}
                    </Button>
                </div>
            </div>

            <Separator className="my-8" />

            {/* Content Section */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            Description
                        </h2>
                        <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line">
                            {casting.description}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Ruler className="w-5 h-5" />
                            Requirements
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {casting.heightCm && (
                                <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                                    <Ruler className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Height</p>
                                        <p className="font-medium">{casting.heightCm} cm</p>
                                    </div>
                                </div>
                            )}
                            {/* Assuming casting model has other fields but type def only had heightCm for simplicty base on plan, adding placeholders if needed or just sticking to defined type */}
                        </div>

                        {casting.skills.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-semibold mb-3">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {casting.skills.map(item => (
                                        <Badge key={item.skill.id} variant="secondary" className="px-3 py-1">
                                            {item.skill.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="bg-muted/30 p-6 rounded-xl border border-border">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            About Agency
                        </h3>
                        {casting.agency ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={casting.agency.logo} alt={casting.agency.name} />
                                        <AvatarFallback>{casting.agency.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold">{casting.agency.name}</p>
                                        <Button variant="link" className="h-auto p-0 text-xs" onClick={() => router.push(`/agencies/${casting.agency!.slug}` as any)}>
                                            View Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">This casting is posted by an independent casting director.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
