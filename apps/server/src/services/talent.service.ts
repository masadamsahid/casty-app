import { talentRepository, type TalentFilters } from "../repositories/talent.repository";

export class TalentService {
    async listTalents(filters: TalentFilters) {
        return await talentRepository.findAll(filters);
    }

    async getTalent(id: string) {
        const talent = await talentRepository.findById(id);
        if (!talent) {
            throw new Error("Talent not found");
        }
        return talent;
    }
}

export const talentService = new TalentService();
