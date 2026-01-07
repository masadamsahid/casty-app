import { userRepository } from "../repositories/user.repository";
import { profileRepository } from "../repositories/profile.repository";
import { experienceRepository } from "../repositories/experience.repository";
import { educationRepository } from "../repositories/education.repository";
import { portfolioRepository } from "../repositories/portfolio.repository";
import { galleryPhotoRepository } from "../repositories/gallery-photo.repository";
import { skillRepository } from "../repositories/skill.repository";
import { db, profileSkill, skill } from "@casty-app/db";
import { eq, and } from "drizzle-orm";
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

    async updateUserSettings(userId: string, data: { name?: string; username?: string; isTalent?: boolean; image?: string }) {
        if (data.username) {
            const existing = await userRepository.findByUsername(data.username);
            if (existing && existing.id !== userId) {
                throw new Error("Username already taken");
            }
        }

        return await userRepository.update(userId, data);
    }

    // Experiences
    async addExperience(userId: string, data: any) {
        const profile = await profileRepository.findByUserId(userId);
        if (!profile) throw new Error("Profile not found");

        const experienceData = {
            ...data,
            startDate: data.startDate && data.startDate !== "" ? data.startDate : null,
            endDate: data.endDate && data.endDate !== "" ? data.endDate : null,
        };

        return await experienceRepository.create({ id: uuidv4(), profileId: profile.id, ...experienceData });
    }
    async updateExperience(id: string, data: any) {
        const experienceData = {
            ...data,
            startDate: data.startDate && data.startDate !== "" ? data.startDate : undefined,
            endDate: data.endDate && data.endDate !== "" ? data.endDate : null, // null if empty
        };
        return await experienceRepository.update(id, experienceData);
    }
    async deleteExperience(id: string) {
        return await experienceRepository.delete(id);
    }

    // Educations
    async addEducation(userId: string, data: any) {
        const profile = await profileRepository.findByUserId(userId);
        if (!profile) throw new Error("Profile not found");

        const educationData = {
            ...data,
            startDate: data.startDate && data.startDate !== "" ? data.startDate : null,
            endDate: data.endDate && data.endDate !== "" ? data.endDate : null,
        };

        return await educationRepository.create({ id: uuidv4(), profileId: profile.id, ...educationData });
    }
    async updateEducation(id: string, data: any) {
        const educationData = {
            ...data,
            startDate: data.startDate && data.startDate !== "" ? data.startDate : undefined,
            endDate: data.endDate && data.endDate !== "" ? data.endDate : null,
        };
        return await educationRepository.update(id, educationData);
    }
    async deleteEducation(id: string) {
        return await educationRepository.delete(id);
    }

    // Portfolios
    async addPortfolio(userId: string, data: any) {
        const profile = await profileRepository.findByUserId(userId);
        if (!profile) throw new Error("Profile not found");
        return await portfolioRepository.create({ id: uuidv4(), profileId: profile.id, ...data });
    }
    async updatePortfolio(id: string, data: any) {
        return await portfolioRepository.update(id, data);
    }
    async deletePortfolio(id: string) {
        return await portfolioRepository.delete(id);
    }

    // Gallery Photos
    async addGalleryPhoto(userId: string, data: { url: string; caption?: string; isMain?: boolean }) {
        const profile = await profileRepository.findByUserId(userId);
        if (!profile) throw new Error("Profile not found");
        return await galleryPhotoRepository.create({ id: uuidv4(), profileId: profile.id, ...data });
    }
    async deleteGalleryPhoto(id: string) {
        return await galleryPhotoRepository.delete(id);
    }
    async setMainGalleryPhoto(id: string, userId: string) {
        const profile = await profileRepository.findByUserId(userId);
        if (!profile) throw new Error("Profile not found");
        return await galleryPhotoRepository.setMain(id, profile.id);
    }

    // Skills
    async addSkill(userId: string, skillName: string) {
        const profile = await profileRepository.findByUserId(userId);
        if (!profile) throw new Error("Profile not found");

        let skillData = (await skillRepository.search(skillName)).find(s => s.name.toLowerCase() === skillName.toLowerCase());

        if (!skillData) {
            const [newSkill] = await db.insert(skill).values({ id: uuidv4(), name: skillName }).returning();
            if (!newSkill) throw new Error("Failed to create skill");
            skillData = newSkill as any;
        }

        const skillId = (skillData as any).id;
        const [exists] = await db.select().from(profileSkill).where(and(eq(profileSkill.profileId, profile.id), eq(profileSkill.skillId, skillId))).limit(1);
        if (exists) return exists;

        const [result] = await db.insert(profileSkill).values({ profileId: profile.id, skillId: skillId }).returning();
        return result;
    }

    async removeSkill(userId: string, skillId: string) {
        const profile = await profileRepository.findByUserId(userId);
        if (!profile) throw new Error("Profile not found");

        const [result] = await db.delete(profileSkill).where(and(eq(profileSkill.profileId, profile.id), eq(profileSkill.skillId, skillId))).returning();
        return result;
    }
}

export const userService = new UserService();
