import { userRepository } from "../repositories/user.repository";
import { profileRepository } from "../repositories/profile.repository";
import { v4 as uuidv4 } from "uuid";

export class UserService {
    async getUserProfile(userId: string) {
        const user = await userRepository.findById(userId);
        if (!user) throw new Error("User not found");

        let profile = await profileRepository.findByUserId(userId);

        return {
            user,
            profile,
        };
    }

    async updateProfile(userId: string, data: any) {
        let profile = await profileRepository.findByUserId(userId);

        if (!profile) {
            profile = await profileRepository.create({
                id: uuidv4(),
                userId,
                fullName: data.fullName || "",
                ...data,
            });
        } else {
            profile = await profileRepository.update(profile.id, data);
        }

        return profile;
    }

    async updateUserSettings(userId: string, data: { username?: string; isTalent?: boolean }) {
        if (data.username) {
            const existing = await userRepository.findByUsername(data.username);
            if (existing && existing.id !== userId) {
                throw new Error("Username already taken");
            }
        }

        return await userRepository.update(userId, data);
    }
}

export const userService = new UserService();
