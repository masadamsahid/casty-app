"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/api/upload";
import { updateSettings } from "@/lib/api/user";
import { toast } from "sonner";

interface AvatarUploadProps {
    currentImage: string | null;
    userName: string;
    onSuccess?: () => void;
}

export default function AvatarUpload({ currentImage, userName, onSuccess }: AvatarUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        try {
            setIsUploading(true);
            const uploadRes = await uploadFile(file, "avatars");
            const imageUrl = uploadRes.data.url;

            await updateSettings({ image: imageUrl });

            toast.success("Avatar updated successfully");
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to update avatar");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-primary/10 transition-all duration-300 group-hover:border-primary/30">
                    <AvatarImage src={currentImage || undefined} className="object-cover" />
                    <AvatarFallback className="text-xl font-bold bg-primary/5 text-primary">
                        {getInitials(userName)}
                    </AvatarFallback>
                </Avatar>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:cursor-not-allowed"
                >
                    {isUploading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                        <Camera className="h-6 w-6" />
                    )}
                </button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <div className="text-center">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : "Change Avatar"}
                </Button>
                <p className="text-[10px] text-muted-foreground mt-2">
                    JPG, PNG or WEBP. Max 5MB.
                </p>
            </div>
        </div>
    );
}
