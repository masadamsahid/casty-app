import axiosClient from "../axios-client";

export interface ChatMessage {
    id: string;
    roomId: string;
    senderId: string;
    content: string;
    type: "text" | "image";
    createdAt: string;
    sender?: {
        id: string;
        name: string;
        image?: string;
    };
}

export const getRoomMessages = async (roomId: string) => {
    const response = await axiosClient.get(`/chat/room/${roomId}`);
    return response.data;
};

export const sendMessage = async (roomId: string, content: string, type: "text" | "image" = "text") => {
    const response = await axiosClient.post(`/chat/room/${roomId}`, { content, type });
    return response.data;
};
