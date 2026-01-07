import axiosClient from "../axios-client";

export interface Skill {
    id: string;
    name: string;
    description?: string;
}

export const searchSkills = async (query: string) => {
    const response = await axiosClient.get("/skills/search", {
        params: { q: query }
    });
    return response.data;
};
