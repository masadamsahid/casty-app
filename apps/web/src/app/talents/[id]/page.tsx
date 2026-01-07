"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTalentById } from "@/lib/api/talents";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, User, Briefcase, GraduationCap, Link as LinkIcon, Mail, Phone, Ruler, Weight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function TalentDetailPage() {
    const { id } = useParams();
    const [talent, setTalent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTalent = async () => {
            setLoading(true);
            try {
                const response = await getTalentById(id as string);
                if (response.success) {
                    setTalent(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch talent:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTalent();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <Skeleton className="aspect-[3/4] w-full md:w-[400px] rounded-3xl" />
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-12 w-1/2" />
                        <Skeleton className="h-6 w-1/3" />
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!talent) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold">Talent not found</h1>
            </div>
        );
    }

    const mainPhoto = talent.galleryPhotos?.find((p: any) => p.isMain)?.url || talent.user?.image;
    const otherPhotos = talent.galleryPhotos?.filter((p: any) => !p.isMain) || [];

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Left Column: Photos & Basic Info */}
                <div className="w-full lg:w-[450px] space-y-8">
                    <div className="aspect-[3/4] relative rounded-3xl overflow-hidden border-4 bg-muted shadow-2xl transition-all hover:shadow-primary/10">
                        {mainPhoto ? (
                            <img src={mainPhoto} alt={talent.fullName} className="object-cover w-full h-full" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">No Profile Photo</div>
                        )}
                    </div>

                    <Card className="rounded-3xl border-2 overflow-hidden bg-muted/30">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <User className="w-5 h-5" /> Physical Features
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-6 p-6 pt-0">
                            <div className="space-y-1">
                                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Height</span>
                                <div className="flex items-center gap-2 font-bold text-lg italic">
                                    <Ruler className="w-4 h-4 text-primary" /> {talent.heightCm || "N/A"} cm
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Weight</span>
                                <div className="flex items-center gap-2 font-bold text-lg italic">
                                    <Weight className="w-4 h-4 text-primary" /> {talent.weightKg || "N/A"} kg
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Hair</span>
                                <div className="font-bold text-lg italic">{talent.hairColor || "N/A"}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Eyes</span>
                                <div className="font-bold text-lg italic">{talent.eyeColor || "N/A"}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {(talent.phone || talent.publicEmail) && (
                        <Card className="rounded-3xl border-2 bg-gradient-to-br from-primary/5 to-transparent">
                            <CardHeader>
                                <CardTitle className="text-xl">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {talent.publicEmail && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-semibold uppercase">Email</p>
                                            <p className="font-medium">{talent.publicEmail}</p>
                                        </div>
                                    </div>
                                )}
                                {talent.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-semibold uppercase">Phone</p>
                                            <p className="font-medium">{talent.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column: Detailed Info */}
                <div className="flex-1 space-y-12">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <Badge className="text-sm font-bold bg-primary text-primary-foreground">
                                {talent.yearsOfExperience || 0} Years Experience
                            </Badge>
                            <Badge variant="outline" className="text-sm border-2">
                                {talent.gender || "Not specified"}
                            </Badge>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight">{talent.fullName}</h1>
                        <div className="flex flex-wrap gap-6 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" /> {talent.country || "Unknown Location"}
                            </div>
                            {talent.birthDate && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" /> Born {new Date(talent.birthDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">About</h2>
                        <div className="text-lg leading-relaxed text-muted-foreground prose prose-neutral dark:prose-invert max-w-none">
                            {talent.description || "No description provided."}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {talent.skills?.map((s: any) => (
                                <Badge key={s.skillId} variant="secondary" className="px-4 py-2 text-sm font-semibold rounded-xl border-2">
                                    {s.skill.name}
                                </Badge>
                            ))}
                            {!talent.skills?.length && <p className="text-muted-foreground">No skills listed.</p>}
                        </div>
                    </section>

                    <Separator className="h-0.5" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-primary" /> Experience
                            </h2>
                            <div className="space-y-6">
                                {talent.experiences?.map((exp: any) => (
                                    <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-primary/20">
                                        <div className="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full bg-primary" />
                                        <h3 className="font-bold text-lg">{exp.title}</h3>
                                        <p className="text-primary font-medium">{exp.company}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
                                        </p>
                                        {exp.description && <p className="mt-2 text-muted-foreground text-sm line-clamp-3">{exp.description}</p>}
                                    </div>
                                ))}
                                {!talent.experiences?.length && <p className="text-muted-foreground">No experiences listed.</p>}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <GraduationCap className="w-6 h-6 text-primary" /> Education
                            </h2>
                            <div className="space-y-6">
                                {talent.educations?.map((edu: any) => (
                                    <div key={edu.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-primary/20">
                                        <div className="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full bg-primary" />
                                        <h3 className="font-bold text-lg">{edu.degree}</h3>
                                        <p className="text-primary font-medium">{edu.institution}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                                        </p>
                                    </div>
                                ))}
                                {!talent.educations?.length && <p className="text-muted-foreground">No education details listed.</p>}
                            </div>
                        </section>
                    </div>

                    {otherPhotos.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">Gallery</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {otherPhotos.map((photo: any) => (
                                    <div key={photo.id} className="aspect-square rounded-2xl overflow-hidden border-2 bg-muted hover:scale-105 transition-all cursor-zoom-in">
                                        <img src={photo.url} alt="Gallery" className="object-cover w-full h-full" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {talent.socialLinks?.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">Social Presence</h2>
                            <div className="flex flex-wrap gap-4">
                                {talent.socialLinks.map((social: any) => (
                                    <a
                                        key={social.id}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 hover:bg-muted transition-colors font-bold uppercase tracking-wider text-sm"
                                    >
                                        <LinkIcon className="w-4 h-4" /> {social.platform}
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
