import { Hono } from "hono";
import {
    getMeHandler,
    updateProfileHandler,
    updateSettingsHandler,
    addExperienceHandler,
    updateExperienceHandler,
    deleteExperienceHandler,
    addEducationHandler,
    updateEducationHandler,
    deleteEducationHandler,
    addPortfolioHandler,
    updatePortfolioHandler,
    deletePortfolioHandler,
    addGalleryPhotoHandler,
    deleteGalleryPhotoHandler,
    setMainGalleryPhotoHandler,
    addSkillHandler,
    removeSkillHandler
} from "../handlers/user.handler";
import { authMiddleware } from "../middleware/auth";

const userRoutes = new Hono();

userRoutes.use("/*", authMiddleware);

userRoutes.get("/me", getMeHandler);
userRoutes.patch("/profile", updateProfileHandler);
userRoutes.patch("/settings", updateSettingsHandler);

// Experiences
userRoutes.post("/experiences", addExperienceHandler);
userRoutes.patch("/experiences/:id", updateExperienceHandler);
userRoutes.delete("/experiences/:id", deleteExperienceHandler);

// Educations
userRoutes.post("/educations", addEducationHandler);
userRoutes.patch("/educations/:id", updateEducationHandler);
userRoutes.delete("/educations/:id", deleteEducationHandler);

// Portfolios
userRoutes.post("/portfolios", addPortfolioHandler);
userRoutes.patch("/portfolios/:id", updatePortfolioHandler);
userRoutes.delete("/portfolios/:id", deletePortfolioHandler);

// Gallery Photos
userRoutes.post("/gallery", addGalleryPhotoHandler);
userRoutes.delete("/gallery/:id", deleteGalleryPhotoHandler);
userRoutes.patch("/gallery/:id/main", setMainGalleryPhotoHandler);

// Skills
userRoutes.post("/skills", addSkillHandler);
userRoutes.delete("/skills/:id", removeSkillHandler);

export default userRoutes;
