import axiosClient from "../axios-client";

export const getMe = async () => {
    const response = await axiosClient.get("/users/me");
    return response.data;
};

export const updateProfile = async (data: any) => {
    const response = await axiosClient.patch("/users/profile", data);
    return response.data;
};

export const updateSettings = async (data: { name?: string; username?: string; isTalent?: boolean; image?: string }) => {
    const response = await axiosClient.patch("/users/settings", data);
    return response.data;
};

// Experiences
export const addExperience = async (data: any) => {
    const response = await axiosClient.post("/users/experiences", data);
    return response.data;
};
export const updateExperience = async (id: string, data: any) => {
    const response = await axiosClient.patch(`/users/experiences/${id}`, data);
    return response.data;
};
export const deleteExperience = async (id: string) => {
    const response = await axiosClient.delete(`/users/experiences/${id}`);
    return response.data;
};

// Educations
export const addEducation = async (data: any) => {
    const response = await axiosClient.post("/users/educations", data);
    return response.data;
};
export const updateEducation = async (id: string, data: any) => {
    const response = await axiosClient.patch(`/users/educations/${id}`, data);
    return response.data;
};
export const deleteEducation = async (id: string) => {
    const response = await axiosClient.delete(`/users/educations/${id}`);
    return response.data;
};

// Portfolios
export const addPortfolio = async (data: any) => {
    const response = await axiosClient.post("/users/portfolios", data);
    return response.data;
};
export const updatePortfolio = async (id: string, data: any) => {
    const response = await axiosClient.patch(`/users/portfolios/${id}`, data);
    return response.data;
};
export const deletePortfolio = async (id: string) => {
    const response = await axiosClient.delete(`/users/portfolios/${id}`);
    return response.data;
};

// Gallery Photos
export const addGalleryPhoto = async (data: { url: string; caption?: string; isMain?: boolean }) => {
    const response = await axiosClient.post("/users/gallery", data);
    return response.data;
};
export const deleteGalleryPhoto = async (id: string) => {
    const response = await axiosClient.delete(`/users/gallery/${id}`);
    return response.data;
};
export const setMainGalleryPhoto = async (id: string) => {
    const response = await axiosClient.patch(`/users/gallery/${id}/main`);
    return response.data;
};

// Skills
export const addSkill = async (name: string) => {
    const response = await axiosClient.post("/users/skills", { name });
    return response.data;
};
export const removeSkill = async (id: string) => {
    const response = await axiosClient.delete(`/users/skills/${id}`);
    return response.data;
};
