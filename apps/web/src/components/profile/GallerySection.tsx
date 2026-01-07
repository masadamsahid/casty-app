"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Star, Loader2 } from "lucide-react";
import { addGalleryPhoto, deleteGalleryPhoto, setMainGalleryPhoto } from "@/lib/api/user";
import { toast } from "sonner";
import Image from "next/image";

interface GallerySectionProps {
    photos: any[];
    onRefresh: () => void;
}

export default function GallerySection({ photos, onRefresh }: GallerySectionProps) {
    const [newPhotoUrl, setNewPhotoUrl] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        if (!newPhotoUrl.trim()) return;
        try {
            setIsAdding(true);
            await addGalleryPhoto({ url: newPhotoUrl.trim() });
            setNewPhotoUrl("");
            onRefresh();
            toast.success("Photo added");
        } catch (error: any) {
            toast.error("Failed to add photo");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteGalleryPhoto(id);
            onRefresh();
            toast.success("Photo deleted");
        } catch (error: any) {
            toast.error("Failed to delete photo");
        }
    };

    const handleSetMain = async (id: string) => {
        try {
            await setMainGalleryPhoto(id);
            onRefresh();
            toast.success("Main photo updated");
        } catch (error: any) {
            toast.error("Failed to update main photo");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <Input
                    placeholder="Enter image URL"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                <Button onClick={handleAdd} disabled={isAdding || !newPhotoUrl.trim()}>
                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">Add Photo</span>
                </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.length === 0 && (
                    <p className="col-span-full text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        No photos added yet.
                    </p>
                )}
                {photos.map((photo: any) => (
                    <Card key={photo.id} className="relative group overflow-hidden aspect-square">
                        <Image
                            src={photo.url}
                            alt="Gallery photo"
                            fill
                            unoptimized
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                size="icon"
                                variant={photo.isMain ? "default" : "secondary"}
                                onClick={() => handleSetMain(photo.id)}
                                title={photo.isMain ? "Main photo" : "Set as main"}
                            >
                                <Star className={`h-4 w-4 ${photo.isMain ? "fill-current" : ""}`} />
                            </Button>
                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => handleDelete(photo.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {photo.isMain && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded shadow-sm">
                                Main
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
