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
import SkillsSection from "@/components/profile/SkillsSection";
import GallerySection from "@/components/profile/GallerySection";
import ExperienceSection from "@/components/profile/ExperienceSection";
import EducationSection from "@/components/profile/EducationSection";
import PortfolioSection from "@/components/profile/PortfolioSection";
import { Edit2, MapPin, Phone, Mail, Calendar, User, Ruler, Weight, Briefcase, Settings, UserCircle, Image as ImageIcon, GraduationCap, FolderSearch, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                                <Ruler className="mr-1 h-3 w-3" /> Height
                                            </div>
                                            <div className="text-sm font-medium">{profile?.heightCm ? `${profile.heightCm} cm` : "N/A"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                                <Weight className="mr-1 h-3 w-3" /> Weight
                                            </div>
                                            <div className="text-sm font-medium">{profile?.weightKg ? `${profile.weightKg} kg` : "N/A"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                                <Briefcase className="mr-1 h-3 w-3" /> Experience
                                            </div>
                                            <div className="text-sm font-medium">{profile?.yearsOfExperience ? `${profile.yearsOfExperience} yrs` : "N/A"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Hair / Eyes</div>
                                            <div className="text-sm font-medium">
                                                {profile?.hairColor || "N/A"} / {profile?.eyeColor || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Secondary Content Sections */}
                        <div className="mt-4">
                            <Tabs defaultValue="gallery" className="w-full">
                                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                                    <TabsTrigger value="gallery" className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 bg-transparent text-sm font-medium transition-all shadow-none">
                                        <ImageIcon className="mr-2 h-4 w-4" /> Gallery
                                    </TabsTrigger>
                                    <TabsTrigger value="skills" className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 bg-transparent text-sm font-medium transition-all shadow-none">
                                        <Star className="mr-2 h-4 w-4" /> Skills
                                    </TabsTrigger>
                                    <TabsTrigger value="experiences" className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 bg-transparent text-sm font-medium transition-all shadow-none">
                                        <Briefcase className="mr-2 h-4 w-4" /> Experiences
                                    </TabsTrigger>
                                    <TabsTrigger value="education" className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 bg-transparent text-sm font-medium transition-all shadow-none">
                                        <GraduationCap className="mr-2 h-4 w-4" /> Education
                                    </TabsTrigger>
                                    <TabsTrigger value="portfolio" className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 bg-transparent text-sm font-medium transition-all shadow-none">
                                        <FolderSearch className="mr-2 h-4 w-4" /> Portfolio
                                    </TabsTrigger>
                                </TabsList>
                                <div className="mt-8">
                                    <TabsContent value="gallery" className="mt-0">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Photo Gallery</CardTitle>
                                                <CardDescription>Manage your professional photos and headshots.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <GallerySection photos={profile?.galleryPhotos || []} onRefresh={fetchData} />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="skills" className="mt-0">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Skills & Talents</CardTitle>
                                                <CardDescription>Add skills and talents to make yourself discoverable.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <SkillsSection initialSkills={profile?.skills || []} onRefresh={fetchData} />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="experiences" className="mt-0">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Work Experience</CardTitle>
                                                <CardDescription>Your professional history in the industry.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <ExperienceSection experiences={profile?.experiences || []} onRefresh={fetchData} />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="education" className="mt-0">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Education & Training</CardTitle>
                                                <CardDescription>Degrees, certificates, and relevant training.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <EducationSection educations={profile?.educations || []} onRefresh={fetchData} />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="portfolio" className="mt-0">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Portfolio & Projects</CardTitle>
                                                <CardDescription>Showcase your best projects and external work links.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <PortfolioSection portfolios={profile?.portfolios || []} onRefresh={fetchData} />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
