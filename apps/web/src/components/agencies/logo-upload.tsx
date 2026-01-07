"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, X, Upload } from "lucide-react";
import { uploadFile } from "@/lib/api/upload";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LogoUploadProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
}

export default function LogoUpload({ value, onChange, className }: LogoUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Logo size should be less than 2MB");
            return;
        }

        try {
            setIsUploading(true);
            const uploadRes = await uploadFile(file, "agency-logos");
            const imageUrl = uploadRes.data.url;

            onChange(imageUrl);
            toast.success("Logo uploaded successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to upload logo");
        } finally {
            setIsUploading(false);
            // Reset input value so the same file can be uploaded again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const removeLogo = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
    };

    return (
        <div className={cn("space-y-4", className)}>
            <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "relative aspect-video w-full rounded-xl border-2 border-dashed border-muted-foreground/25 transition-all duration-300 hover:border-primary/50 cursor-pointer flex flex-col items-center justify-center gap-3 bg-muted/50 overflow-hidden group",
                    value && "border-solid border-primary/20 bg-background"
                )}
            >
                {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium">Uploading logo...</p>
                    </div>
                ) : value ? (
                    <>
                        <img
                            src={value}
                            alt="Logo Preview"
                            className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="font-bold"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                            >
                                Change
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="font-bold"
                                onClick={removeLogo}
                            >
                                Remove
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold">Click to upload logo</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG or WEBP (Max 2MB)
                            </p>
                        </div>
                    </>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
}
