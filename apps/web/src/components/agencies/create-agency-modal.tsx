"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import LogoUpload from "./logo-upload";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createAgency } from "@/lib/api/agencies";

const agencySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    slug: z.string().min(2, "Slug must be at least 2 characters.").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    description: z.string().optional(),
    logo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type AgencyFormValues = z.infer<typeof agencySchema>;

export default function CreateAgencyModal() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const form = useForm<AgencyFormValues>({
        resolver: zodResolver(agencySchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            logo: "",
        },
    });

    async function onSubmit(data: AgencyFormValues) {
        try {
            await createAgency(data);
            toast.success("Agency created successfully");
            setOpen(false);
            form.reset();
            router.refresh();
            // Optionally redirect to the newly created agency
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to create agency");
        }
    }

    // Auto-generate slug from name
    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        form.setValue("name", name);
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        form.setValue("slug", slug, { shouldValidate: true });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="font-bold">
                    <Plus className="mr-2 h-4 w-4" /> Create New Agency
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Agency</DialogTitle>
                    <DialogDescription>
                        Register your agency to start managing talents and castings.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Agency Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Titan Management" {...field} onChange={(e) => {
                                            field.onChange(e);
                                            onNameChange(e);
                                        }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (<FormItem>
                                <FormLabel>Handle / Slug</FormLabel>
                                <FormControl>
                                    <div className="flex items-center">
                                        <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-sm text-muted-foreground whitespace-nowrap">
                                            casty.app/agencies/
                                        </span>
                                        <Input placeholder="titan-mgmt" className="rounded-l-none" {...field} />
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    This will be the unique URL for your agency.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Agency Logo</FormLabel>
                                    <FormControl>
                                        <LogoUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us about your agency..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Creating..." : "Create Agency"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
