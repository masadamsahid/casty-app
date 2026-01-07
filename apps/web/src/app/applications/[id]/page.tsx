"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getApplicationById, updateApplicationStatus, type Application } from "@/lib/api/applications";
import { getMe } from "@/lib/api/user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Calendar, Clock, MapPin, Building2, Check, X, MessageSquare, Info } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import ChatRoom from "@/components/chat/chat-room";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function ApplicationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const showChatInitial = searchParams.get("chat") === "true";

    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [updating, setUpdating] = useState(false);
    const [showChat, setShowChat] = useState(showChatInitial);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [appRes, userRes] = await Promise.all([
                    getApplicationById(id),
                    getMe(),
                ]);

                if (appRes.success) {
                    setApplication(appRes.data);
                }
                if (userRes.success) {
                    setUser(userRes.data);
                }
            } catch (error) {
                console.error("Error fetching application:", error);
                toast.error("Failed to load application details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleStatusUpdate = async (status: Application["status"]) => {
        setUpdating(true);
        try {
            const res = await updateApplicationStatus(id, status);
            if (res.success) {
                toast.success(`Application ${status} successfully`);
                const updatedRes = await getApplicationById(id);
                if (updatedRes.success) {
                    setApplication(updatedRes.data);
                }
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
                <Skeleton className="h-8 w-1/3" />
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                    </div>
                    <div>
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold">Application not found</h1>
                <Button variant="link" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const isManager = user?.user?.id === application.casting?.managerId;
    const isApplicant = user?.user?.id === application.talentId;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant={
                            application.status === "accepted" ? "success" :
                                application.status === "rejected" ? "destructive" :
                                    application.status === "shortlisted" ? "secondary" : "outline"
                        } className="capitalize">
                            {application.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            Applied on {format(new Date(application.createdAt), "MMM d, yyyy")}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Application Details</h1>
                    <p className="text-muted-foreground">
                        For <Link href={`/castings/${application.castingId}`} className="text-primary hover:underline font-medium">{application.casting?.title}</Link>
                    </p>
                </div>

                {isManager && application.status === "pending" && (
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => handleStatusUpdate("shortlisted")} disabled={updating}>
                            Shortlist
                        </Button>
                        <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => handleStatusUpdate("rejected")} disabled={updating}>
                            <X className="w-4 h-4 mr-2" />
                            Reject
                        </Button>
                    </div>
                )}
                {isManager && application.status === "shortlisted" && (
                    <div className="flex gap-2">
                        <Button variant="default" onClick={() => handleStatusUpdate("accepted")} disabled={updating}>
                            <Check className="w-4 h-4 mr-2" />
                            Accept
                        </Button>
                        <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => handleStatusUpdate("rejected")} disabled={updating}>
                            Reject
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column: Application & Talent Info */}
                <div className="lg:col-span-7 space-y-8">
                    <section className="bg-card border rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Applicant Information
                        </h2>
                        <div className="flex items-center gap-4 mb-6">
                            <Avatar className="h-16 w-16 border">
                                <AvatarImage src={application.talent?.image} alt={application.talent?.name} />
                                <AvatarFallback>{application.talent?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-bold">{application.talent?.profile?.fullName || application.talent?.name}</h3>
                                {application.talent?.profile?.country && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {application.talent.profile.country}
                                    </p>
                                )}
                                <Button variant="link" className="p-0 h-auto text-xs" asChild>
                                    <Link href={`/talents/${application.talent?.profile?.id}`}>View Full Profile</Link>
                                </Button>
                            </div>
                        </div>

                        {application.coverLetter && (
                            <>
                                <Separator className="my-6" />
                                <div>
                                    <h3 className="font-semibold mb-2">Cover Letter</h3>
                                    <div className="bg-muted/30 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-line">
                                        {application.coverLetter}
                                    </div>
                                </div>
                            </>
                        )}
                    </section>

                    <section className="bg-card border rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            Casting Summary
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Casting Title</p>
                                <p className="font-medium">{application.casting?.title}</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Status</p>
                                    <Badge variant="outline" className="capitalize">{application.casting?.status}</Badge>
                                </div>
                                {application.casting?.deadline && (
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Deadline</p>
                                        <p className="text-sm">{format(new Date(application.casting.deadline), "MMM d, yyyy")}</p>
                                    </div>
                                )}
                            </div>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/castings/${application.castingId}`}>
                                    <Info className="w-4 h-4 mr-2" />
                                    View Casting Details
                                </Link>
                            </Button>
                        </div>
                    </section>
                </div>

                {/* Right Column: Chat */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24">
                        {application.chatRoom ? (
                            <ChatRoom
                                roomId={application.chatRoom.id}
                                currentUserId={user?.user?.id}
                            />
                        ) : (
                            <div className="bg-card border rounded-2xl p-8 text-center">
                                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                <p className="text-muted-foreground">Chat is not available for this application.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
