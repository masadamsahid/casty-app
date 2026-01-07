import { castingRepository } from "../repositories/casting.repository";
import { v4 as uuidv4 } from "uuid";

export class CastingService {
    async getCastings(filters: any) {
        return await castingRepository.findAll(filters);
    }

    async getCastingById(id: string) {
        const result = await castingRepository.findById(id);
        if (!result) throw new Error("Casting not found");
        return result;
    }

    async createCasting(userId: string, data: any) {
        const { skills, categoryName, ...castingData } = data;

        let categoryId = castingData.categoryId;
        if (!categoryId && categoryName) {
            const category = await castingRepository.createCategory(categoryName);
            categoryId = category?.id;
        }

        const id = uuidv4();
        const castingInsertData: any = {
            id,
            managerId: userId,
            categoryId,
            ...castingData,
        };

        if (castingInsertData.heightCm !== undefined) {
            castingInsertData.heightPreference = castingInsertData.heightCm.toString();
            delete castingInsertData.heightCm;
        }

        if (castingInsertData.deadline && typeof castingInsertData.deadline === 'string') {
            castingInsertData.deadline = new Date(castingInsertData.deadline);
        }

        await castingRepository.create(castingInsertData);

        if (skills && Array.isArray(skills)) {
            for (const skillId of skills) {
                await castingRepository.addSkillPreference(id, skillId);
            }
        }

        return await this.getCastingById(id);
    }

    async updateCasting(userId: string, castingId: string, data: any) {
        const casting = await castingRepository.findById(castingId);
        if (!casting) throw new Error("Casting not found");
        if (casting.managerId !== userId) throw new Error("Unauthorized");

        const { skillIds, skills, categoryId, categoryName, ...castingData } = data;

        const updateData: any = { ...castingData };

        if (updateData.heightCm !== undefined) {
            updateData.heightPreference = updateData.heightCm ? updateData.heightCm.toString() : null;
            delete updateData.heightCm;
        }

        if (updateData.deadline && typeof updateData.deadline === 'string') {
            updateData.deadline = new Date(updateData.deadline);
        }

        if (categoryId) {
            updateData.categoryId = categoryId;
        } else if (categoryName) {
            const category = await castingRepository.createCategory(categoryName);
            updateData.categoryId = category?.id;
        }

        // Ensure we don't pass fields not in the schema
        delete updateData.id;
        delete updateData.managerId;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        delete updateData.category; // If it leaked from frontend
        delete updateData.agency;   // If it leaked from frontend

        await castingRepository.update(castingId, updateData);

        const newSkills = skillIds || skills;
        if (newSkills && Array.isArray(newSkills)) {
            await castingRepository.clearSkills(castingId);
            for (const skillId of newSkills) {
                await castingRepository.addSkillPreference(castingId, skillId);
            }
        }

        return await this.getCastingById(castingId);
    }

    async deleteCasting(userId: string, castingId: string) {
        const casting = await castingRepository.findById(castingId);
        if (!casting) throw new Error("Casting not found");
        if (casting.managerId !== userId) throw new Error("Unauthorized");

        return await castingRepository.delete(castingId);
    }

    async getCategories() {
        return await castingRepository.findCategories();
    }
}

export const castingService = new CastingService();
