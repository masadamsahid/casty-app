"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { type Casting, type CastingCategory, getCategories } from "@/lib/api/castings";
import { searchSkills, type Skill } from "@/lib/api/skills";
import { getAgencies } from "@/lib/api/agencies";
import { toast } from "sonner";

const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    location: z.string().optional(),
    heightCm: z.coerce.number().optional(),
    deadline: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
        return arg;
    }, z.date()).optional(),
    budget: z.string().optional(),
    isCoverLetterRequired: z.boolean().default(false),
    status: z.enum(["draft", "published", "closed"]),
    categoryId: z.string().min(1, "Category is required"),
    agencyId: z.string().optional(),
    skillIds: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

interface CastingFormProps {
    initialData?: Casting;
    onSubmit: (data: FormValues) => Promise<void>;
    loading?: boolean;
}

export default function CastingForm({ initialData, onSubmit, loading }: CastingFormProps) {
    const [categories, setCategories] = useState<CastingCategory[]>([]);
    const [agencies, setAgencies] = useState<any[]>([]);
    const [skillsQuery, setSkillsQuery] = useState("");
    const [searchedSkills, setSearchedSkills] = useState<Skill[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<Skill[]>(
        initialData?.skills.map((s) => s.skill) || []
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            location: initialData?.location || "",
            heightCm: initialData?.heightCm || undefined,
            deadline: initialData?.deadline ? new Date(initialData.deadline) : undefined,
            budget: initialData?.budget || "",
            isCoverLetterRequired: initialData?.isCoverLetterRequired || false,
            status: (initialData?.status.toLowerCase() as any) || "published",
            categoryId: initialData?.category.id || "",
            agencyId: initialData?.agencyId || "none",
            skillIds: initialData?.skills.map((s) => s.skill.id) || [],
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, agenciesRes] = await Promise.all([
                    getCategories(),
                    getAgencies(),
                ]);
                if (catsRes.success) setCategories(catsRes.data);
                if (agenciesRes.success) setAgencies(agenciesRes.data);
            } catch (error) {
                console.error("Failed to fetch form dependencies:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (skillsQuery.length >= 2) {
                try {
                    const res = await searchSkills(skillsQuery);
                    if (res.success) setSearchedSkills(res.data);
                } catch (error) {
                    console.error("Failed to search skills:", error);
                }
            } else {
                setSearchedSkills([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [skillsQuery]);

    const toggleSkill = (skill: Skill) => {
        const isSelected = selectedSkills.some((s) => s.id === skill.id);
        let newSelected;
        if (isSelected) {
            newSelected = selectedSkills.filter((s) => s.id !== skill.id);
        } else {
            newSelected = [...selectedSkills, skill];
        }
        setSelectedSkills(newSelected);
        form.setValue("skillIds", newSelected.map((s) => s.id));
    };

    const handleSubmit = async (values: FormValues) => {
        try {
            const submissionData = {
                ...values,
                agencyId: values.agencyId === "none" ? undefined : values.agencyId,
                deadline: values.deadline ? values.deadline.toISOString() : undefined,
            };
            await onSubmit(submissionData as any);
        } catch (error: any) {
            toast.error(error.message || "Failed to submit form");
        }
    };

    return (
        <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-6">
                {/* Row 1: Title & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Lead actor for..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Row 2: Post as Agency & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="agencyId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Post as Agency (Optional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Independent" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">Independent</SelectItem>
                                        {agencies.map((agency) => (
                                            <SelectItem key={agency.id} value={agency.id}>
                                                {agency.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    If you are posting on behalf of an agency you manage.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Row 3: Location & Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="Jakarta, Remote, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Budget</FormLabel>
                                <FormControl>
                                    <Input placeholder="Negotiable, $500/day, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Row 4: Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us about the role..."
                                    className="min-h-[150px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Row 5: Height */}
                <FormField
                    control={form.control}
                    name="heightCm"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Min Height (cm)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="170" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Row 6: Required Skills */}
                <div className="space-y-4">
                    <FormLabel>Required Skills</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedSkills.map((skill) => (
                            <Badge key={skill.id} variant="secondary" className="pl-2 pr-1 py-1">
                                {skill.name}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 ml-1 hover:bg-transparent"
                                    onClick={() => toggleSkill(skill)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        ))}
                        {selectedSkills.length === 0 && (
                            <p className="text-sm text-muted-foreground">No skills selected</p>
                        )}
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-full md:w-[300px] justify-between"
                            >
                                Search skills...
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full md:w-[300px] p-0">
                            <Command shouldFilter={false}>
                                <CommandInput
                                    placeholder="Search skill..."
                                    onValueChange={setSkillsQuery}
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        {skillsQuery.length < 2
                                            ? "Type at least 2 characters..."
                                            : "No skill found."}
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {searchedSkills.map((skill) => (
                                            <CommandItem
                                                key={skill.id}
                                                onSelect={() => {
                                                    toggleSkill(skill);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedSkills.some((s) => s.id === skill.id)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {skill.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Row 7: Deadline */}
                <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="mb-2">Deadline</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Row 8: Require Cover Letter */}
                <FormField
                    control={form.control}
                    name="isCoverLetterRequired"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Require Cover Letter
                                </FormLabel>
                                <FormDescription>
                                    Applicants must provide a cover letter.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : (initialData ? "Update Casting" : "Create Casting")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
