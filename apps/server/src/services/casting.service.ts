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
        await castingRepository.create({
            id,
            managerId: userId,
            categoryId,
            ...castingData,
        });

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

        return await castingRepository.update(castingId, data);
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
