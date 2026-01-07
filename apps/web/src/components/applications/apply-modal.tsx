"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { applyToCasting } from "@/lib/api/applications";
import { Loader2 } from "lucide-react";

const applySchema = z.object({
    coverLetter: z.string().min(10, {
        message: "Cover letter must be at least 10 characters.",
    }).optional().or(z.literal("")),
});

type ApplyFormValues = z.infer<typeof applySchema>;

interface ApplyModalProps {
    castingId: string;
    castingTitle: string;
    isCoverLetterRequired: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function ApplyModal({
    castingId,
    castingTitle,
    isCoverLetterRequired,
    open,
    onOpenChange,
    onSuccess,
}: ApplyModalProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm<ApplyFormValues>({
        resolver: zodResolver(applySchema),
        defaultValues: {
            coverLetter: "",
        },
    });

    const onSubmit = async (values: ApplyFormValues) => {
        if (isCoverLetterRequired && !values.coverLetter) {
            form.setError("coverLetter", { message: "Cover letter is required for this casting." });
            return;
        }

        setLoading(true);
        try {
            const res = await applyToCasting({
                castingId,
                coverLetter: values.coverLetter || undefined,
            });

            if (res.success) {
                toast.success("Application submitted successfully!");
                onOpenChange(false);
                onSuccess?.();
            } else {
                toast.error(res.error?.message || "Failed to submit application");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Apply for Casting</DialogTitle>
                    <DialogDescription>
                        You are applying for: <span className="font-semibold text-foreground">{castingTitle}</span>
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="coverLetter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Cover Letter {isCoverLetterRequired && <span className="text-destructive">*</span>}
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Introduce yourself and explain why you're a good fit..."
                                            className="min-h-[150px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Application
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
