"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/lib/api/user";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProfileForm from "@/components/profile-form";
import { Edit2, MapPin, Phone, Mail, Calendar, User, Ruler, Weight, Briefcase } from "lucide-react";

export default function MePage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getMe();
            setData(res.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Skeleton className="h-12 w-48 mb-6" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-destructive">Error</h2>
                <p className="mt-2 text-muted-foreground">{error}</p>
                <Button className="mt-4" onClick={fetchData}>Retry</Button>
            </div>
        );
    }

    const { user, profile } = data;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground">Manage your personal and professional profile information.</p>
                </div>
                <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full md:w-auto"
                >
                    {isEditing ? "Cancel" : (
                        <>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Profile
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {isEditing ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Your Information</CardTitle>
                            <CardDescription>Update your profile details to make yourself more discoverable.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm
                                initialData={profile}
                                onSuccess={() => {
                                    setIsEditing(false);
                                    fetchData();
                                }}
                            />
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Basic Info */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-2xl">
                                        {profile?.fullName || user.name}
                                    </CardTitle>
                                    <CardDescription>@{user.username || "username_not_set"}</CardDescription>
                                </div>
                                {user.isTalent && (
                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                        Talent
                                    </Badge>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div className="flex items-center text-sm">
                                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span>{user.email}</span>
                                    </div>
                                    {profile?.country && (
                                        <div className="flex items-center text-sm">
                                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{profile.country}</span>
                                        </div>
                                    )}
                                    {profile?.phone && (
                                        <div className="flex items-center text-sm">
                                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{profile.phone}</span>
                                        </div>
                                    )}
                                    {profile?.publicEmail && profile.publicEmail !== user.email && (
                                        <div className="flex items-center text-sm">
                                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{profile.publicEmail} (Public)</span>
                                        </div>
                                    )}
                                    {profile?.birthDate && (
                                        <div className="flex items-center text-sm">
                                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>Born on {new Date(profile.birthDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {profile?.gender && (
                                        <div className="flex items-center text-sm capitalize">
                                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{profile.gender}</span>
                                        </div>
                                    )}
                                </div>

                                {profile?.description && (
                                    <>
                                        <Separator className="my-6" />
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">About Me</h3>
                                            <p className="text-sm text-balance leading-relaxed whitespace-pre-wrap">
                                                {profile.description}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Physical & Professional Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Physical & Professional Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                            <Ruler className="mr-1 h-3.0 w-3.0" /> Height
                                        </div>
                                        <div className="text-lg font-medium">{profile?.heightCm ? `${profile.heightCm} cm` : "N/A"}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                            <Weight className="mr-1 h-3.0 w-3.0" /> Weight
                                        </div>
                                        <div className="text-lg font-medium">{profile?.weightKg ? `${profile.weightKg} kg` : "N/A"}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                            <Briefcase className="mr-1 h-3.0 w-3.0" /> Experience
                                        </div>
                                        <div className="text-lg font-medium">{profile?.yearsOfExperience ? `${profile.yearsOfExperience} years` : "N/A"}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Hair / Eyes</div>
                                        <div className="text-lg font-medium">
                                            {profile?.hairColor || "N/A"} / {profile?.eyeColor || "N/A"}
                                        </div>
                                    </div>
                                </div>

                                {profile?.skinTone && (
                                    <div className="mt-6 space-y-1">
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Skin Tone</div>
                                        <div className="text-lg font-medium">{profile.skinTone}</div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Skills (Placeholder for future implementation if needed, though skills are in the data) */}
                        {profile?.skills && profile.skills.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Skills</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills.map((s: any) => (
                                            <Badge key={s.skill.id} variant="outline">
                                                {s.skill.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
