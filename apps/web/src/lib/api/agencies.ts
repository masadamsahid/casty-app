import axiosClient from "../axios-client";

export interface CreateAgencyData {
    name: string;
    slug: string;
    description?: string;
    logo?: string;
}

export const getAgencies = async () => {
    const response = await axiosClient.get("/agencies");
    return response.data;
};

export const getAgencyById = async (id: string) => {
    const response = await axiosClient.get(`/agencies/${id}`);
    return response.data;
};

export const createAgency = async (data: CreateAgencyData) => {
    const response = await axiosClient.post("/agencies", data);
    return response.data;
};
