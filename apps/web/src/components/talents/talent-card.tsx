"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";

interface TalentCardProps {
    talent: {
        id: string;
        fullName: string;
        country?: string | null;
        gender?: string | null;
        yearsOfExperience?: number | null;
        skills?: { skill: { name: string } }[];
        galleryPhotos?: { url: string }[];
        user?: { image?: string | null };
    };
}

export default function TalentCard({ talent }: TalentCardProps) {
    const mainPhoto = talent.galleryPhotos?.[0]?.url || talent.user?.image;
    const topSkills = talent.skills?.slice(0, 3).map((s) => s.skill.name) || [];

    return (
        <Link href={`/talents/${talent.id}`}>
            <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 border-2">
                <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                    {mainPhoto ? (
                        <img
                            src={mainPhoto}
                            alt={talent.fullName}
                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            No Photo
                        </div>
                    )}
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="backdrop-blur-sm bg-white/50 dark:bg-black/50">
                            {talent.gender || "N/A"}
                        </Badge>
                    </div>
                </div>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="font-bold text-lg truncate">{talent.fullName}</h3>
                        {talent.yearsOfExperience !== null && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                {talent.yearsOfExperience} yrs
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                        <MapPin className="w-3 h-3" />
                        {talent.country || "Unknown Location"}
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {topSkills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-[10px] px-1.5 py-0">
                                {skill}
                            </Badge>
                        ))}
                        {talent.skills && talent.skills.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{talent.skills.length - 3}</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
