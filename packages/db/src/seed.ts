import { db } from "./index";
import { user, profile, skill, profileSkill, castingCategory } from "./schema";
import { faker } from "@faker-js/faker";

async function main() {
    console.log("🌱 Seeding database...");

    // 1. Create Skills
    const commonSkills = [
        "Acting", "Singing", "Dancing", "Voice Acting", "Modeling",
        "Stunt Work", "Martial Arts", "Piano", "Guitar", "Public Speaking"
    ];

    console.log("Creating skills...");
    const skillIds: string[] = [];
    for (const skillName of commonSkills) {
        const id = crypto.randomUUID();
        await db.insert(skill).values({
            id,
            name: skillName,
            description: faker.lorem.sentence(),
        }).onConflictDoNothing();

        // We need to fetch the actual ID if it already existed, or just use the one we generated if it was inserted
        // To keep it simple for a seeder, we'll just query them back
        const s = await db.query.skill.findFirst({
            where: (skills, { eq }) => eq(skills.name, skillName)
        });
        if (s) skillIds.push(s.id);
    }

    // 2. Create Casting Categories
    const categories = ["Film", "Television", "Commercial", "Theater", "Voiceover", "Print"];
    console.log("Creating casting categories...");
    const categoryIds: string[] = [];
    for (const catName of categories) {
        const id = crypto.randomUUID();
        await db.insert(castingCategory).values({
            id,
            name: catName,
        }).onConflictDoNothing();

        const c = await db.query.castingCategory.findFirst({
            where: (cats, { eq }) => eq(cats.name, catName)
        });
        if (c) categoryIds.push(c.id);
    }

    // 3. Create Users and Profiles
    console.log("Creating users and profiles...");
    for (let i = 0; i < 20; i++) {
        const userId = crypto.randomUUID();
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const fullName = `${firstName} ${lastName}`;
        const email = faker.internet.email({ firstName, lastName }).toLowerCase();

        await db.insert(user).values({
            id: userId,
            name: fullName,
            email,
            emailVerified: true,
            username: faker.internet.username({ firstName, lastName }).toLowerCase() + i,
            isTalent: faker.datatype.boolean(0.8), // 80% are talents
        });

        const profileId = crypto.randomUUID();
        await db.insert(profile).values({
            id: profileId,
            userId,
            fullName,
            description: faker.lorem.paragraphs(2),
            country: faker.location.country(),
            heightCm: faker.number.int({ min: 150, max: 200 }),
            weightKg: faker.number.int({ min: 45, max: 100 }),
            yearsOfExperience: faker.number.int({ min: 0, max: 20 }),
            hairColor: faker.color.human(),
            eyeColor: faker.color.human(),
            skinTone: faker.helpers.arrayElement(["Fair", "Light", "Medium", "Olive", "Tan", "Brown", "Dark"]),
            birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
            gender: faker.helpers.arrayElement(["male", "female", "other"]),
            phone: faker.phone.number(),
            publicEmail: email,
        });

        // Assign 1-3 random skills
        const numSkills = faker.number.int({ min: 1, max: 3 });
        const selectedSkills = faker.helpers.arrayElements(skillIds, numSkills);
        for (const skillId of selectedSkills) {
            await db.insert(profileSkill).values({
                profileId,
                skillId,
            }).onConflictDoNothing();
        }
    }

    console.log("✅ Seeding completed!");
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Seeding failed:");
    console.error(err);
    process.exit(1);
});
