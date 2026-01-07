"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Loader2 } from "lucide-react";
import { addSkill, removeSkill } from "@/lib/api/user";
import { toast } from "sonner";

interface SkillsSectionProps {
    initialSkills: any[];
    onRefresh: () => void;
}

export default function SkillsSection({ initialSkills, onRefresh }: SkillsSectionProps) {
    const [newSkill, setNewSkill] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        if (!newSkill.trim()) return;
        try {
            setIsAdding(true);
            await addSkill(newSkill.trim());
            setNewSkill("");
            onRefresh();
            toast.success("Skill added");
        } catch (error: any) {
            toast.error("Failed to add skill");
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemove = async (skillId: string) => {
        try {
            await removeSkill(skillId);
            onRefresh();
            toast.success("Skill removed");
        } catch (error: any) {
            toast.error("Failed to remove skill");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Add a skill (e.g. Acting, Dancing)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                <Button onClick={handleAdd} disabled={isAdding || !newSkill.trim()}>
                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">Add</span>
                </Button>
            </div>
            <div className="flex flex-wrap gap-2">
                {initialSkills.length === 0 && (
                    <p className="text-sm text-muted-foreground">No skills added yet.</p>
                )}
                {initialSkills.map((s: any) => (
                    <Badge key={s.skill.id} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                        {s.skill.name}
                        <button
                            onClick={() => handleRemove(s.skill.id)}
                            className="ml-1 hover:text-destructive transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    );
}
