import { agencyRepository } from "../repositories/agency.repository";
import { v4 as uuidv4, validate as isValidUUID } from "uuid";

export class AgencyService {
    async getAllAgencies() {
        return await agencyRepository.findAll();
    }

    async getAgencyById(idOrSlug: string) {
        let result;

        if (isValidUUID(idOrSlug)) {
            result = await agencyRepository.findById(idOrSlug);
        }

        if (!result) {
            result = await agencyRepository.findBySlug(idOrSlug);
        }

        if (!result) throw new Error("Agency not found");
        return result;
    }

    async createAgency(userId: string, data: any) {
        const id = uuidv4();
        const result = await agencyRepository.create({
            id,
            ownerId: userId,
            ...data,
        });

        // Add owner as owner member
        await agencyRepository.addMember({
            id: uuidv4(),
            agencyId: id,
            userId,
            role: "owner",
        });

        return result;
    }

    async updateAgency(userId: string, agencyId: string, data: any) {
        const agency = await agencyRepository.findById(agencyId);
        if (!agency) throw new Error("Agency not found");
        if (agency.ownerId !== userId) throw new Error("Unauthorized");

        return await agencyRepository.update(agencyId, data);
    }

    async manageMembership(adminId: string, agencyId: string, userId: string, action: "add" | "remove", role: "admin" | "talent" = "talent") {
        const agency = await agencyRepository.findById(agencyId);
        if (!agency) throw new Error("Agency not found");

        const adminMember = await agencyRepository.getMember(agencyId, adminId);
        if (!adminMember || (adminMember.role !== "owner" && adminMember.role !== "admin")) {
            throw new Error("Unauthorized to manage members");
        }

        if (action === "add") {
            const existing = await agencyRepository.getMember(agencyId, userId);
            if (existing) throw new Error("User already a member");

            return await agencyRepository.addMember({
                id: uuidv4(),
                agencyId,
                userId,
                role,
            });
        } else {
            if (userId === agency.ownerId) throw new Error("Cannot remove owner");
            return await agencyRepository.removeMember(agencyId, userId);
        }
    }
}

export const agencyService = new AgencyService();
