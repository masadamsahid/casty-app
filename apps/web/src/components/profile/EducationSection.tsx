"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Loader2, Calendar, School } from "lucide-react";
import { addEducation, updateEducation, deleteEducation } from "@/lib/api/user";
import { toast } from "sonner";

interface EducationSectionProps {
    educations: any[];
    onRefresh: () => void;
}

export default function EducationSection({ educations, onRefresh }: EducationSectionProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        description: "",
    });

    const resetForm = () => {
        setFormData({
            degree: "",
            institution: "",
            startDate: "",
            endDate: "",
            description: "",
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleEdit = (edu: any) => {
        setFormData({
            degree: edu.degree,
            institution: edu.institution,
            startDate: edu.startDate,
            endDate: edu.endDate || "",
            description: edu.description || "",
        });
        setEditingId(edu.id);
        setIsAdding(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingId) {
                await updateEducation(editingId, formData);
                toast.success("Education updated");
            } else {
                await addEducation(formData);
                toast.success("Education added");
            }
            onRefresh();
            resetForm();
        } catch (error: any) {
            toast.error("Failed to save education");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteEducation(id);
            onRefresh();
            toast.success("Education deleted");
        } catch (error: any) {
            toast.error("Failed to delete education");
        }
    };

    return (
        <div className="space-y-6">
            {!isAdding && (
                <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full border-dashed">
                    <Plus className="mr-2 h-4 w-4" /> Add Education
                </Button>
            )}

            {isAdding && (
                <Card>
                    <CardHeader>
                        <CardTitle>{editingId ? "Edit Education" : "Add Education"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Degree/Certificate</label>
                                    <Input
                                        required
                                        value={formData.degree}
                                        onChange={e => setFormData({ ...formData, degree: e.target.value })}
                                        placeholder="e.g. B.A. in Theatre"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Institution</label>
                                    <Input
                                        required
                                        value={formData.institution}
                                        onChange={e => setFormData({ ...formData, institution: e.target.value })}
                                        placeholder="e.g. Juilliard School"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 col-span-full">
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
                                    placeholder="Relevant coursework, honors, etc."
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
                {educations.length === 0 && !isAdding && (
                    <p className="text-center py-8 text-muted-foreground">No education added yet.</p>
                )}
                {educations.map((edu: any) => (
                    <Card key={edu.id} className="relative group">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-lg">{edu.degree}</h4>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                        <div className="flex items-center">
                                            <School className="mr-1 h-3 w-3" /> {edu.institution}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
                                        </div>
                                    </div>
                                    {edu.description && (
                                        <p className="text-sm mt-3 whitespace-pre-wrap">{edu.description}</p>
                                    )}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" onClick={() => handleEdit(edu)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(edu.id)}>
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
