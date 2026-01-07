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

        const profileData: any = {
            fullName: data.fullName || "",
            description: data.description || null,
            country: data.country || null,
            heightCm: data.heightCm ? Number(data.heightCm) : null,
            weightKg: data.weightKg ? Number(data.weightKg) : null,
            yearsOfExperience: data.yearsOfExperience !== undefined && data.yearsOfExperience !== null ? Number(data.yearsOfExperience) : null,
            hairColor: data.hairColor || null,
            eyeColor: data.eyeColor || null,
            skinTone: data.skinTone || null,
            birthDate: data.birthDate && data.birthDate !== "" ? data.birthDate : null,
            gender: data.gender || null,
            phone: data.phone || null,
            publicEmail: data.publicEmail || null,
        };

        if (!profile) {
            profile = await profileRepository.create({
                id: uuidv4(),
                userId,
                ...profileData,
            });
        } else {
            profile = await profileRepository.update(profile.id, profileData);
        }

        return profile;
    }

    async updateUserSettings(userId: string, data: { name?: string; username?: string; isTalent?: boolean }) {
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
