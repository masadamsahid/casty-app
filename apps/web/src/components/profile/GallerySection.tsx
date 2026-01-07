"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Star, Loader2 } from "lucide-react";
import { addGalleryPhoto, deleteGalleryPhoto, setMainGalleryPhoto } from "@/lib/api/user";
import { uploadFile } from "@/lib/api/upload";
import { toast } from "sonner";
import Image from "next/image";
import { useRef } from "react";

interface GallerySectionProps {
    photos: any[];
    onRefresh: () => void;
}

export default function GallerySection({ photos, onRefresh }: GallerySectionProps) {
    const [isAdding, setIsAdding] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit for gallery
            toast.error("Image size should be less than 10MB");
            return;
        }

        try {
            setIsAdding(true);
            const uploadRes = await uploadFile(file, "gallery");
            const imageUrl = uploadRes.data.url;

            await addGalleryPhoto({ url: imageUrl });
            onRefresh();
            toast.success("Photo added to gallery");

            // Clear input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to add photo");
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    Upload photos to showcase your work and personality.
                </p>
                <div className="relative">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isAdding}
                    >
                        {isAdding ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Plus className="h-4 w-4 mr-2" />
                        )}
                        Upload Photo
                    </Button>
                </div>
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
