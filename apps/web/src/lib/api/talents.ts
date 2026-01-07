import axiosClient from "../axios-client";

export interface TalentFilters {
    name?: string;
    agencyIds?: string[];
    skillIds?: string[];
    country?: string;
    gender?: "male" | "female" | "other";
    minAge?: number;
    maxAge?: number;
    minHeight?: number;
    maxHeight?: number;
    minWeight?: number;
    maxWeight?: number;
    minExperience?: number;
    maxExperience?: number;
    limit?: number;
    offset?: number;
    sortBy?: "age" | "height" | "weight" | "experience";
    sortOrder?: "asc" | "desc";
}

export const getTalents = async (filters: TalentFilters = {}) => {
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

    const response = await axiosClient.get("/talents", { params });
    return response.data;
};

export const getTalentById = async (id: string) => {
    const response = await axiosClient.get(`/talents/${id}`);
    return response.data;
};

export const searchSkills = async (query: string) => {
    const response = await axiosClient.get(`/skills/search?q=${query}`);
    return response.data;
};
