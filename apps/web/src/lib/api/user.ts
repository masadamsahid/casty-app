import axiosClient from "../axios-client";

export const getMe = async () => {
    const response = await axiosClient.get("/users/me");
    return response.data;
};

export const updateProfile = async (data: any) => {
    const response = await axiosClient.patch("/users/profile", data);
    return response.data;
};

export const updateSettings = async (data: { name?: string; username?: string; isTalent?: boolean }) => {
    const response = await axiosClient.patch("/users/settings", data);
    return response.data;
};
