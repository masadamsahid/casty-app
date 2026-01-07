"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Loader2, ExternalLink, Image as ImageIcon } from "lucide-react";
import { addPortfolio, updatePortfolio, deletePortfolio } from "@/lib/api/user";
import { toast } from "sonner";
import Image from "next/image";

interface PortfolioSectionProps {
    portfolios: any[];
    onRefresh: () => void;
}

export default function PortfolioSection({ portfolios, onRefresh }: PortfolioSectionProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        url: "",
        image: "",
    });

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            url: "",
            image: "",
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleEdit = (item: any) => {
        setFormData({
            title: item.title,
            description: item.description || "",
            url: item.url || "",
            image: item.image || "",
        });
        setEditingId(item.id);
        setIsAdding(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingId) {
                await updatePortfolio(editingId, formData);
                toast.success("Portfolio item updated");
            } else {
                await addPortfolio(formData);
                toast.success("Portfolio item added");
            }
            onRefresh();
            resetForm();
        } catch (error: any) {
            toast.error("Failed to save portfolio item");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deletePortfolio(id);
            onRefresh();
            toast.success("Portfolio item deleted");
        } catch (error: any) {
            toast.error("Failed to delete portfolio item");
        }
    };

    return (
        <div className="space-y-6">
            {!isAdding && (
                <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full border-dashed">
                    <Plus className="mr-2 h-4 w-4" /> Add Portfolio Item
                </Button>
            )}

            {isAdding && (
                <Card>
                    <CardHeader>
                        <CardTitle>{editingId ? "Edit Portfolio Item" : "Add Portfolio Item"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Short Film: The Silent Room"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Project URL</label>
                                    <Input
                                        value={formData.url}
                                        onChange={e => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="e.g. https://youtube.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Image URL</label>
                                    <Input
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="e.g. Thumbnail URL"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the project and your role..."
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {portfolios.length === 0 && !isAdding && (
                    <p className="col-span-full text-center py-8 text-muted-foreground">No portfolio items added yet.</p>
                )}
                {portfolios.map((item: any) => (
                    <Card key={item.id} className="relative group overflow-hidden">
                        {item.image && (
                            <div className="relative h-48 w-full">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            </div>
                        )}
                        {!item.image && (
                            <div className="h-48 w-full bg-muted flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                        )}
                        <CardContent className="pt-6">
                            <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                            {item.description && (
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{item.description}</p>
                            )}
                            <div className="flex justify-between items-center mt-auto">
                                {item.url && (
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary text-sm flex items-center hover:underline"
                                    >
                                        <ExternalLink className="mr-1 h-3 w-3" /> View Project
                                    </a>
                                )}
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                    <Button size="icon" variant="secondary" onClick={() => handleEdit(item)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="secondary" className="text-destructive" onClick={() => handleDelete(item.id)}>
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
