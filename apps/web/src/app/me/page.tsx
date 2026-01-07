"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/lib/api/user";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProfileForm from "@/components/profile-form";
import AccountForm from "@/components/account-form";
import { Edit2, MapPin, Phone, Mail, Calendar, User, Ruler, Weight, Briefcase, Settings, UserCircle } from "lucide-react";

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
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-64 mb-2" />
                            <Skeleton className="h-4 w-96" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-64 mb-2" />
                            <Skeleton className="h-4 w-96" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                </div>
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
                    <>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-primary" />
                                    <CardTitle>Account Settings</CardTitle>
                                </div>
                                <CardDescription>Update your essential account information.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AccountForm
                                    initialData={{
                                        name: user.name,
                                        username: user.username,
                                        isTalent: user.isTalent,
                                    }}
                                    onSuccess={fetchData}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <UserCircle className="h-5 w-5 text-primary" />
                                    <CardTitle>Profile Details</CardTitle>
                                </div>
                                <CardDescription>Update your professional profile to make yourself more discoverable.</CardDescription>
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
                    </>
                ) : (
                    <>
                        {/* Account Details Section */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-primary" />
                                    <CardTitle>Account Details</CardTitle>
                                </div>
                                {user.isTalent && (
                                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                                        Active Talent
                                    </Badge>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Display Name</p>
                                        <p className="text-lg font-medium">{user.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Username</p>
                                        <p className="text-lg font-medium">@{user.username || "not_set"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                                        <div className="flex items-center gap-2 text-lg font-medium">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            {user.email}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={user.isTalent ? "default" : "outline"}>
                                                {user.isTalent ? "Talent Account" : "Standard Account"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Separator className="my-2" />

                        {/* Profile Info */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <UserCircle className="h-5 w-5 text-primary" />
                                    <CardTitle>Profile Information</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="text-2xl font-bold">
                                        {profile?.fullName || user.name}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        {profile?.publicEmail && (
                                            <div className="flex items-center text-sm">
                                                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                                <span>{profile.publicEmail} (Public Contact)</span>
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
                                        <div className="pt-4 border-t">
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">About Me</h3>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                {profile.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
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

                        {/* Skills */}
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
