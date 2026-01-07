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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateProfile } from "@/lib/api/user";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    description: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    heightCm: z.preprocess((val) => (val === "" || val === null ? null : Number(val)), z.number().int().positive().nullable().optional()),
    weightKg: z.preprocess((val) => (val === "" || val === null ? null : Number(val)), z.number().int().positive().nullable().optional()),
    yearsOfExperience: z.preprocess((val) => (val === "" || val === null ? null : Number(val)), z.number().int().nonnegative().nullable().optional()),
    hairColor: z.string().optional().nullable(),
    eyeColor: z.string().optional().nullable(),
    skinTone: z.string().optional().nullable(),
    birthDate: z.string().optional().nullable(),
    gender: z.enum(["male", "female", "other"]).optional().nullable(),
    phone: z.string().optional().nullable(),
    publicEmail: z.string().email().optional().nullable().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    initialData: any;
    onSuccess?: () => void;
}

export default function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
    const router = useRouter();
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema) as any,
        defaultValues: {
            fullName: initialData?.fullName || "",
            description: initialData?.description || "",
            country: initialData?.country || "",
            heightCm: initialData?.heightCm || null,
            weightKg: initialData?.weightKg || null,
            yearsOfExperience: initialData?.yearsOfExperience || null,
            hairColor: initialData?.hairColor || "",
            eyeColor: initialData?.eyeColor || "",
            skinTone: initialData?.skinTone || "",
            birthDate: initialData?.birthDate || "",
            gender: (initialData?.gender as any) || null,
            phone: initialData?.phone || "",
            publicEmail: initialData?.publicEmail || "",
        },
    });

    async function onSubmit(data: ProfileFormValues) {
        try {
            await updateProfile(data);
            toast.success("Profile updated successfully");
            if (onSuccess) onSuccess();
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to update profile");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="publicEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Public Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="john@example.com" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+1234567890" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input placeholder="USA" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Birth Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="heightCm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Height (cm)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="weightKg"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Weight (kg)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="hairColor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hair Color</FormLabel>
                                <FormControl>
                                    <Input placeholder="Black" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="eyeColor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Eye Color</FormLabel>
                                <FormControl>
                                    <Input placeholder="Brown" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="skinTone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Skin Tone</FormLabel>
                                <FormControl>
                                    <Input placeholder="Fair" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="yearsOfExperience"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Years of Experience</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio / Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us about yourself..."
                                    className="min-h-32"
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormDescription>
                                Briefly describe your professional background and interest.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full md:w-auto">Save Changes</Button>
            </form>
        </Form>
    );
}
