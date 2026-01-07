"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase } from "lucide-react";

interface AgencyCardProps {
    agency: {
        id: string;
        name: string;
        description?: string | null;
        logo?: string | null;
        slug: string;
        members?: { role: string }[];
    };
}

export default function AgencyCard({ agency }: AgencyCardProps) {
    const talentCount = agency.members?.filter((m) => m.role === "talent").length || 0;

    return (
        <Link href={`/agencies/${agency.slug}`}>
            <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 border-2 group">
                <div className="aspect-video relative overflow-hidden bg-muted flex items-center justify-center p-6 pb-0">
                    {agency.logo ? (
                        <img
                            src={agency.logo}
                            alt={agency.name}
                            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <span className="text-3xl font-bold text-primary">
                                {agency.name.charAt(0)}
                            </span>
                        </div>
                    )}
                </div>
                <CardContent className="p-5">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-xl truncate group-hover:text-primary transition-colors">
                            {agency.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-2">
                            {agency.description || "No description provided."}
                        </p>

                        <div className="flex items-center gap-4 text-sm font-medium">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>{talentCount} Talents</span>
                            </div>
                            <Badge variant="outline" className="ml-auto text-xs font-mono font-normal">
                                @{agency.slug}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
