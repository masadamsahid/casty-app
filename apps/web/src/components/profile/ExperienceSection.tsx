"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Loader2, Calendar, MapPin, Briefcase } from "lucide-react";
import { addExperience, updateExperience, deleteExperience } from "@/lib/api/user";
import { toast } from "sonner";

interface ExperienceSectionProps {
    experiences: any[];
    onRefresh: () => void;
}

export default function ExperienceSection({ experiences, onRefresh }: ExperienceSectionProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
    });

    const resetForm = () => {
        setFormData({
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleEdit = (exp: any) => {
        setFormData({
            title: exp.title,
            company: exp.company,
            location: exp.location || "",
            startDate: exp.startDate,
            endDate: exp.endDate || "",
            description: exp.description || "",
        });
        setEditingId(exp.id);
        setIsAdding(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingId) {
                await updateExperience(editingId, formData);
                toast.success("Experience updated");
            } else {
                await addExperience(formData);
                toast.success("Experience added");
            }
            onRefresh();
            resetForm();
        } catch (error: any) {
            toast.error("Failed to save experience");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteExperience(id);
            onRefresh();
            toast.success("Experience deleted");
        } catch (error: any) {
            toast.error("Failed to delete experience");
        }
    };

    return (
        <div className="space-y-6">
            {!isAdding && (
                <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full border-dashed">
                    <Plus className="mr-2 h-4 w-4" /> Add Experience
                </Button>
            )}

            {isAdding && (
                <Card>
                    <CardHeader>
                        <CardTitle>{editingId ? "Edit Experience" : "Add Experience"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title</label>
                                    <Input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Lead Actor"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Company/Production</label>
                                    <Input
                                        required
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="e.g. Marvel Studios"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Location</label>
                                    <Input
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g. Los Angeles, CA"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Start Date</label>
                                        <Input
                                            type="date"
                                            required
                                            value={formData.startDate}
                                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">End Date</label>
                                        <Input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe your role and accomplishments..."
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {experiences.length === 0 && !isAdding && (
                    <p className="text-center py-8 text-muted-foreground">No experience added yet.</p>
                )}
                {experiences.map((exp: any) => (
                    <Card key={exp.id} className="relative group">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-lg">{exp.title}</h4>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                        <div className="flex items-center">
                                            <Briefcase className="mr-1 h-3 w-3" /> {exp.company}
                                        </div>
                                        {exp.location && (
                                            <div className="flex items-center">
                                                <MapPin className="mr-1 h-3 w-3" /> {exp.location}
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                                        </div>
                                    </div>
                                    {exp.description && (
                                        <p className="text-sm mt-3 whitespace-pre-wrap">{exp.description}</p>
                                    )}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" onClick={() => handleEdit(exp)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(exp.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
