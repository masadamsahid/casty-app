"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Share2, Globe, Mail } from "lucide-react";
import { toast } from "sonner";

interface AgencyHeaderProps {
    agency: any;
    isOwner: boolean;
}

export default function AgencyHeader({ agency, isOwner }: AgencyHeaderProps) {
    const copyLink = () => {
        const url = `${window.location.origin}/agencies/${agency.slug}`;
        navigator.clipboard.writeText(url);
        toast.success("Agency link copied to clipboard");
    };

    return (
        <div className="relative mb-8">
            {/* Banner / Cover Area */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-3xl border-2 border-dashed border-primary/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            </div>

            {/* Agency Info Container */}
            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Logo */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-background bg-background shadow-xl flex items-center justify-center overflow-hidden shrink-0">
                        {agency.logo ? (
                            <img
                                src={agency.logo}
                                alt={agency.name}
                                className="w-full h-full object-contain p-2"
                            />
                        ) : (
                            <div className="text-4xl font-bold text-primary">
                                {agency.name.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 pt-2 md:pt-20 space-y-2">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{agency.name}</h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="secondary" className="font-mono">@{agency.slug}</Badge>
                            {agency.website && (
                                <a href={agency.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                                    <Globe className="w-4 h-4" /> Website
                                </a>
                            )}
                        </div>
                        {agency.description && (
                            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
                                {agency.description}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 md:pt-20">
                        <Button variant="outline" size="sm" onClick={copyLink}>
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                        {isOwner && (
                            <Button size="sm">
                                <Settings className="w-4 h-4 mr-2" /> Manage
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
