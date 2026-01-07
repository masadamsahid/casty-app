"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface MembersListProps {
    members: any[];
}

export default function MembersList({ members }: MembersListProps) {
    // Sort members: Owner first, then Admins, then Talents
    const sortedMembers = [...members].sort((a, b) => {
        const roles = { owner: 0, admin: 1, talent: 2 };
        return (roles[a.role as keyof typeof roles] || 99) - (roles[b.role as keyof typeof roles] || 99);
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedMembers.map((member) => (
                <Card key={member.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-primary/10">
                            <AvatarImage src={member.user.image || undefined} />
                            <AvatarFallback>{member.user.fullName?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold truncate">{member.user.fullName}</h4>
                                <Badge variant={member.role === 'owner' ? "default" : member.role === 'admin' ? "secondary" : "outline"} className="capitalize text-xs">
                                    {member.role}
                                </Badge>
                            </div>
                            {member.role === 'talent' && (
                                <Link href={`/talents/${member.user.profile?.id || member.userId}`} className="text-xs text-primary hover:underline mt-1 block">
                                    View Profile
                                </Link>
                            )}
                            {member.role !== 'talent' && (
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {member.user.email}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
            {members.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                    No members found in this agency.
                </div>
            )}
        </div>
    );
}
