import { applicationRepository } from "../repositories/application.repository";
import { castingRepository } from "../repositories/casting.repository";
import { v4 as uuidv4 } from "uuid";

export class ApplicationService {
    async getMyApplications(userId: string) {
        return await applicationRepository.findAllByUserId(userId);
    }

    async getApplicationById(id: string) {
        const result = await applicationRepository.findById(id);
        if (!result) throw new Error("Application not found");
        return result;
    }

    async getApplicationsByCastingId(managerId: string, castingId: string) {
        const casting = await castingRepository.findById(castingId);
        if (!casting) throw new Error("Casting not found");

        if (casting.managerId !== managerId) {
            throw new Error("Unauthorized to view applications");
        }

        return await applicationRepository.findAllByCastingId(castingId);
    }

    async applyToCasting(userId: string, data: any) {
        const { castingId, coverLetter, agencyId } = data;

        const existing = await applicationRepository.findByCastingAndTalent(castingId, userId);
        if (existing) throw new Error("Already applied to this casting");

        const id = uuidv4();
        const result = await applicationRepository.create({
            id,
            talentId: userId,
            castingId,
            coverLetter,
            agencyId,
            status: "pending",
        });

        // Create chat room automatically
        await applicationRepository.createChatRoom(id, uuidv4());

        return result;
    }

    async updateApplicationStatus(managerId: string, applicationId: string, status: any) {
        const application = await applicationRepository.findById(applicationId);
        if (!application) throw new Error("Application not found");

        // Check if user is the casting manager or agency owner/admin
        if (application.casting.managerId !== managerId) {
            // More complex agency check could follow if needed
            throw new Error("Unauthorized to update status");
        }

        return await applicationRepository.updateStatus(applicationId, status);
    }
}

export const applicationService = new ApplicationService();
