import { pgTable, text, timestamp, boolean, integer, pgEnum, date, index, primaryKey } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { relations } from "drizzle-orm";

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const castingStatusEnum = pgEnum("casting_status", ["draft", "published", "closed"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "shortlisted", "accepted", "rejected"]);
export const agencyRoleEnum = pgEnum("agency_role", ["owner", "admin", "talent"]);
export const messageTypeEnum = pgEnum("message_type", ["text", "image"]);

export const profile = pgTable("profile", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" })
        .unique(),
    fullName: text("full_name").notNull(),
    description: text("description"), // rich text support
    country: text("country"),
    heightCm: integer("height_cm"),
    weightKg: integer("weight_kg"),
    yearsOfExperience: integer("years_of_experience"),
    hairColor: text("hair_color"),
    eyeColor: text("eye_color"),
    skinTone: text("skin_tone"),
    birthDate: date("birth_date"),
    gender: genderEnum("gender"),
    phone: text("phone"),
    publicEmail: text("public_email"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const skill = pgTable("skill", {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    description: text("description"),
});

export const profileSkill = pgTable("profile_skill", {
    profileId: text("profile_id")
        .notNull()
        .references(() => profile.id, { onDelete: "cascade" }),
    skillId: text("skill_id")
        .notNull()
        .references(() => skill.id, { onDelete: "cascade" }),
}, (t) => [
    primaryKey({ columns: [t.profileId, t.skillId] }),
]);

export const experience = pgTable("experience", {
    id: text("id").primaryKey(),
    profileId: text("profile_id")
        .notNull()
        .references(() => profile.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    company: text("company").notNull(),
    location: text("location"),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"), // null means currently working
    description: text("description"),
});

export const education = pgTable("education", {
    id: text("id").primaryKey(),
    profileId: text("profile_id")
        .notNull()
        .references(() => profile.id, { onDelete: "cascade" }),
    degree: text("degree").notNull(),
    institution: text("institution").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    description: text("description"),
});

export const portfolio = pgTable("portfolio", {
    id: text("id").primaryKey(),
    profileId: text("profile_id")
        .notNull()
        .references(() => profile.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    url: text("url"),
    image: text("image"),
});

export const socialLink = pgTable("social_link", {
    id: text("id").primaryKey(),
    profileId: text("profile_id")
        .notNull()
        .references(() => profile.id, { onDelete: "cascade" }),
    platform: text("platform").notNull(), // e.g. instagram, twitter, linkedin
    url: text("url").notNull(),
});

export const galleryPhoto = pgTable("gallery_photo", {
    id: text("id").primaryKey(),
    profileId: text("profile_id")
        .notNull()
        .references(() => profile.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    caption: text("caption"),
    isMain: boolean("is_main").default(false).notNull(),
});

export const agency = pgTable("agency", {
    id: text("id").primaryKey(),
    ownerId: text("owner_id")
        .notNull()
        .references(() => user.id),
    name: text("name").notNull(),
    description: text("description"),
    logo: text("logo"),
    slug: text("slug").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const agencyMember = pgTable("agency_member", {
    id: text("id").primaryKey(),
    agencyId: text("agency_id")
        .notNull()
        .references(() => agency.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    role: agencyRoleEnum("role").default("talent").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (t) => [
    index("agency_member_agency_idx").on(t.agencyId),
    index("agency_member_user_idx").on(t.userId),
]);

export const castingCategory = pgTable("casting_category", {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
});

export const casting = pgTable("casting", {
    id: text("id").primaryKey(),
    managerId: text("manager_id")
        .notNull()
        .references(() => user.id),
    agencyId: text("agency_id")
        .references(() => agency.id),
    categoryId: text("category_id")
        .notNull()
        .references(() => castingCategory.id),
    title: text("title").notNull(),
    description: text("description").notNull(), // rich text support
    location: text("location"),
    heightPreference: text("height_preference"),
    deadline: timestamp("deadline"),
    budget: text("budget"),
    isCoverLetterRequired: boolean("is_cover_letter_required").default(false).notNull(),
    status: castingStatusEnum("status").default("draft").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const castingSkill = pgTable("casting_skill", {
    castingId: text("casting_id")
        .notNull()
        .references(() => casting.id, { onDelete: "cascade" }),
    skillId: text("skill_id")
        .notNull()
        .references(() => skill.id, { onDelete: "cascade" }),
}, (t) => [
    primaryKey({ columns: [t.castingId, t.skillId] }),
]);

export const application = pgTable("application", {
    id: text("id").primaryKey(),
    castingId: text("casting_id")
        .notNull()
        .references(() => casting.id, { onDelete: "cascade" }),
    talentId: text("talent_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    agencyId: text("agency_id") // if applied via agency
        .references(() => agency.id),
    coverLetter: text("cover_letter"),
    status: applicationStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const chatRoom = pgTable("chat_room", {
    id: text("id").primaryKey(),
    applicationId: text("application_id")
        .notNull()
        .references(() => application.id, { onDelete: "cascade" })
        .unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessage = pgTable("chat_message", {
    id: text("id").primaryKey(),
    roomId: text("room_id")
        .notNull()
        .references(() => chatRoom.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
        .notNull()
        .references(() => user.id),
    content: text("content").notNull(),
    type: messageTypeEnum("type").default("text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const profileRelations = relations(profile, ({ one, many }) => ({
    user: one(user, { fields: [profile.userId], references: [user.id] }),
    skills: many(profileSkill),
    experiences: many(experience),
    educations: many(education),
    portfolios: many(portfolio),
    socialLinks: many(socialLink),
    galleryPhotos: many(galleryPhoto),
}));

export const skillRelations = relations(skill, ({ many }) => ({
    profiles: many(profileSkill),
    castings: many(castingSkill),
}));

export const profileSkillRelations = relations(profileSkill, ({ one }) => ({
    profile: one(profile, { fields: [profileSkill.profileId], references: [profile.id] }),
    skill: one(skill, { fields: [profileSkill.skillId], references: [skill.id] }),
}));

export const experienceRelations = relations(experience, ({ one }) => ({
    profile: one(profile, { fields: [experience.profileId], references: [profile.id] }),
}));

export const educationRelations = relations(education, ({ one }) => ({
    profile: one(profile, { fields: [education.profileId], references: [profile.id] }),
}));

export const portfolioRelations = relations(portfolio, ({ one }) => ({
    profile: one(profile, { fields: [portfolio.profileId], references: [profile.id] }),
}));

export const socialLinkRelations = relations(socialLink, ({ one }) => ({
    profile: one(profile, { fields: [socialLink.profileId], references: [profile.id] }),
}));

export const galleryPhotoRelations = relations(galleryPhoto, ({ one }) => ({
    profile: one(profile, { fields: [galleryPhoto.profileId], references: [profile.id] }),
}));

export const agencyRelations = relations(agency, ({ one, many }) => ({
    owner: one(user, { fields: [agency.ownerId], references: [user.id] }),
    members: many(agencyMember),
    castings: many(casting),
}));

export const agencyMemberRelations = relations(agencyMember, ({ one }) => ({
    agency: one(agency, { fields: [agencyMember.agencyId], references: [agency.id] }),
    user: one(user, { fields: [agencyMember.userId], references: [user.id] }),
}));

export const castingCategoryRelations = relations(castingCategory, ({ many }) => ({
    castings: many(casting),
}));

export const castingRelations = relations(casting, ({ one, many }) => ({
    manager: one(user, { fields: [casting.managerId], references: [user.id] }),
    agency: one(agency, { fields: [casting.agencyId], references: [agency.id] }),
    category: one(castingCategory, { fields: [casting.categoryId], references: [castingCategory.id] }),
    skills: many(castingSkill),
    applications: many(application),
}));

export const castingSkillRelations = relations(castingSkill, ({ one }) => ({
    casting: one(casting, { fields: [castingSkill.castingId], references: [casting.id] }),
    skill: one(skill, { fields: [castingSkill.skillId], references: [skill.id] }),
}));

export const applicationRelations = relations(application, ({ one }) => ({
    casting: one(casting, { fields: [application.castingId], references: [casting.id] }),
    talent: one(user, { fields: [application.talentId], references: [user.id] }),
    agency: one(agency, { fields: [application.agencyId], references: [agency.id] }),
    chatRoom: one(chatRoom),
}));

export const chatRoomRelations = relations(chatRoom, ({ one, many }) => ({
    application: one(application, { fields: [chatRoom.applicationId], references: [application.id] }),
    messages: many(chatMessage),
}));

export const chatMessageRelations = relations(chatMessage, ({ one }) => ({
    room: one(chatRoom, { fields: [chatMessage.roomId], references: [chatRoom.id] }),
    sender: one(user, { fields: [chatMessage.senderId], references: [user.id] }),
}));
