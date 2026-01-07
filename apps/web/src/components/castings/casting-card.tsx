"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Banknote, User } from "lucide-react";
import { format } from "date-fns";
import type { Casting } from "@/lib/api/castings";

interface CastingCardProps {
    casting: Casting;
}

export default function CastingCard({ casting }: CastingCardProps) {
    return (
        <Link href={`/castings/${casting.id}` as any}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2 flex flex-col group">
                <CardHeader className="p-4 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                        <Badge variant="outline" className="w-fit">{casting.category.name}</Badge>
                        {casting.deadline && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap bg-muted/50 px-2 py-1 rounded-md">
                                <Calendar className="w-3 h-3" />
                                {new Date(casting.deadline) < new Date() ? (
                                    <span className="text-destructive font-medium">Closed</span>
                                ) : (
                                    <span>Expires {format(new Date(casting.deadline), "MMM d")}</span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <Avatar className="h-12 w-12 rounded-lg border">
                            <AvatarImage src={casting.agency?.logo} alt={casting.agency?.name || "Independent"} />
                            <AvatarFallback className="rounded-lg bg-muted">
                                {casting.agency?.name ? (
                                    casting.agency.name.substring(0, 2).toUpperCase()
                                ) : (
                                    <User className="h-6 w-6 text-muted-foreground" />
                                )}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                {casting.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 truncate">
                                {casting.agency ? `by ${casting.agency.name}` : "Independent Casting"}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex grow">
                    <div className="flex flex-col gap-2 mt-2 w-full">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span className="truncate">{casting.location || "Remote / Unspecified"}</span>
                        </div>
                        {casting.budget && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Banknote className="w-4 h-4 shrink-0" />
                                <span className="truncate">{casting.budget}</span>
                            </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-1">
                            {casting.skills.slice(0, 3).map((item) => (
                                <Badge key={item.skill.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                                    {item.skill.name}
                                </Badge>
                            ))}
                            {casting.skills.length > 3 && (
                                <span className="text-[10px] text-muted-foreground self-center">+{casting.skills.length - 3}</span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
