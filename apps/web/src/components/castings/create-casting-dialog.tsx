"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import CastingForm from "./casting-form";
import { createCasting } from "@/lib/api/castings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreateCastingDialogProps {
    buttonText?: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
    className?: string;
    onSuccess?: () => void;
}

export default function CreateCastingDialog({
    buttonText = "Post Casting",
    variant = "default",
    className,
    onSuccess,
}: CreateCastingDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        setLoading(true);
        try {
            const res = await createCasting(data);
            if (res.success) {
                toast.success("Casting created successfully!");
                setOpen(false);
                router.refresh();
                if (onSuccess) onSuccess();
            } else {
                toast.error(res.error?.message || "Failed to create casting");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || error.message || "Failed to create casting");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={variant} className={className}>
                    <Plus className="mr-2 h-4 w-4" />
                    {buttonText}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Post a New Casting</DialogTitle>
                </DialogHeader>
                <CastingForm onSubmit={handleSubmit} loading={loading} />
            </DialogContent>
        </Dialog>
    );
}
