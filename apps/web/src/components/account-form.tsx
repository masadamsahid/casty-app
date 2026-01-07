"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateSettings } from "@/lib/api/user";
import { useRouter } from "next/navigation";

const accountSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    username: z.string().min(3, "Username must be at least 3 characters.")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
    isTalent: z.boolean().default(false),
});

type AccountFormValues = z.infer<typeof accountSchema>;

interface AccountFormProps {
    initialData: {
        name: string;
        username: string | null;
        isTalent: boolean;
    };
    onSuccess?: () => void;
}

export default function AccountForm({ initialData, onSuccess }: AccountFormProps) {
    const router = useRouter();
    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema) as any,
        defaultValues: {
            name: initialData.name || "",
            username: initialData.username || "",
            isTalent: !!initialData.isTalent,
        },
    });

    async function onSubmit(data: AccountFormValues) {
        try {
            await updateSettings(data);
            toast.success("Account settings updated successfully");
            if (onSuccess) onSuccess();
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to update account settings");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="johndoe" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Your unique handle on Casty.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="isTalent"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Talent Status</FormLabel>
                                <FormDescription>
                                    Mark yourself as a talent to be discoverable by agencies and casting managers.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit">Update Account</Button>
            </form>
        </Form>
    );
}
