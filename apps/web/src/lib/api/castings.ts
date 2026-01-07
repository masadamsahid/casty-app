import axiosClient from "../axios-client";

export interface CastingFilters {
    title?: string;
    agencyId?: string;
    location?: string;
    skillIds?: string[];
    categoryId?: string;
    minBudget?: number;
    maxBudget?: number;
    status?: "draft" | "published" | "closed";
    limit?: number;
    offset?: number;
    sortBy?: "created_at" | "deadline";
    sortOrder?: "asc" | "desc";
}

export interface CastingCategory {
    id: string;
    name: string;
}

export interface Casting {
    id: string;
    title: string;
    description: string;
    location?: string;
    heightCm?: number;
    deadline?: string;
    budget?: string;
    isCoverLetterRequired: boolean;
    status: "draft" | "published" | "closed";
    createdAt: string;
    updatedAt: string;
    managerId: string;
    agencyId?: string;
    category: CastingCategory;
    agency?: {
        id: string;
        name: string;
        logo?: string;
        slug: string;
    };
    skills: {
        skill: {
            id: string;
            name: string;
        };
    }[];
}

export interface CreateCastingData {
    title: string;
    description: string;
    location?: string;
    categoryId?: string;
    categoryName?: string;
    heightCm?: number;
    deadline?: string;
    budget?: string;
    isCoverLetterRequired?: boolean;
    status?: "draft" | "published" | "closed";
    skills?: string[];
    agencyId?: string;
}

export const createCasting = async (data: CreateCastingData) => {
    const response = await axiosClient.post("/castings", data);
    return response.data;
};

export const updateCasting = async (id: string, data: Partial<CreateCastingData>) => {
    const response = await axiosClient.patch(`/castings/${id}`, data);
    return response.data;
};

export const getCastings = async (filters: CastingFilters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                value.forEach((v) => params.append(`${key}[]`, v));
            } else {
                params.append(key, value.toString());
            }
        }
    });

    const response = await axiosClient.get("/castings", { params });
    return response.data;
};

export const getMyCastings = async (filters: CastingFilters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                value.forEach((v) => params.append(`${key}[]`, v));
            } else {
                params.append(key, value.toString());
            }
        }
    });

    const response = await axiosClient.get("/castings/my", { params });
    return response.data;
};

export const getCastingById = async (id: string) => {
    const response = await axiosClient.get(`/castings/${id}`);
    return response.data;
};

export const getCategories = async () => {
    const response = await axiosClient.get("/castings/categories");
    return response.data;
}
