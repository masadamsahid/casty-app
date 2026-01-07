import axiosClient from "../axios-client";
import { type Casting } from "./castings";

export interface Application {
    id: string;
    castingId: string;
    talentId: string;
    agencyId?: string;
    coverLetter?: string;
    status: "pending" | "shortlisted" | "accepted" | "rejected";
    createdAt: string;
    updatedAt: string;
    casting?: Casting;
    talent?: {
        id: string;
        name: string;
        image?: string;
        profile?: {
            id: string;
            fullName: string;
            country?: string;
        }
    };
    agency?: {
        id: string;
        name: string;
        logo?: string;
    };
    chatRoom?: {
        id: string;
    };
}

export interface ApplyData {
    castingId: string;
    coverLetter?: string;
    agencyId?: string;
}

export const applyToCasting = async (data: ApplyData) => {
    const response = await axiosClient.post("/applications", data);
    return response.data;
};

export const getMyApplications = async () => {
    const response = await axiosClient.get("/applications/me");
    return response.data;
};

export const getApplicationById = async (id: string) => {
    const response = await axiosClient.get(`/applications/${id}`);
    return response.data;
};

export const getCastingApplications = async (castingId: string) => {
    const response = await axiosClient.get(`/castings/${castingId}/applications`);
    return response.data;
};

export const updateApplicationStatus = async (id: string, status: Application["status"]) => {
    const response = await axiosClient.patch(`/applications/${id}/status`, { status });
    return response.data;
};
